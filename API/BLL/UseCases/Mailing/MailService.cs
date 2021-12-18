using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using API.BLL.Helper;
using API.BLL.UseCases.Files;
using API.BLL.Extensions;
using Microsoft.Extensions.Options;

namespace API.BLL.UseCases.Mailing
{
    public interface IMailService
    {
        void SendMail(string recipient, string subject, string body, List<File> attachments);
        void SendBccMails(HashSet<string> recipients, string subject, string body, List<File> attachments);
    }

    public class MailService : IMailService
    {
        private readonly AppSettings appSettings;

        public MailService(IOptions<AppSettings> appSettings)
        {
            this.appSettings = appSettings.Value;
        }

        public void SendMail(string recipient, string subject, string body, List<File> attachments)
        {
            if (!appSettings.IsMailSendingActive)
                return;

            if (appSettings.IsDevServer)
                recipient = appSettings.DefaultMailTo;

            if (!recipient.IsValidEmail())
                return;

            var smtpClient = new SmtpClient(appSettings.SmptHost)
            {
                Port = appSettings.SmptPort,
                Credentials = new NetworkCredential(appSettings.SmptUser, appSettings.SmptPassword),
                EnableSsl = true,
            };

            var mail = new MailMessage(appSettings.SmptEmailAddress, recipient, subject, body)
            {
                IsBodyHtml = true
            };

            if (attachments.Count > 0)
                foreach (var attachment in attachments)
                {
                    var att = new Attachment(attachment.Stream, attachment.Ident.Ident.ToString(), attachment.MimeType);
                    att.ContentId = attachment.Ident.Ident.ToString();
                    att.Name = attachment.Name;
                    att.ContentDisposition.Inline = true;
                    att.ContentDisposition.DispositionType = DispositionTypeNames.Inline;
                    mail.Attachments.Add(att);
                }

            smtpClient.Send(mail);

            smtpClient.Dispose();
        }

        public void SendBccMails(HashSet<string> recipients, string subject, string body, List<File> attachments)
        {
            if (!appSettings.IsMailSendingActive)
                return;

            var validRecipients = appSettings.IsDevServer
                ? new HashSet<string> { appSettings.DefaultMailTo }
                : FilterInvalidMails(recipients);

            if (!validRecipients.Any())
                return;


            var smtpClient = new SmtpClient(appSettings.SmptHost)
            {
                Port = appSettings.SmptPort,
                Credentials = new NetworkCredential(appSettings.SmptUser, appSettings.SmptPassword),
                EnableSsl = true,
            };

            var mail = new MailMessage()
            {
                From = new MailAddress(appSettings.SmptEmailAddress),
                IsBodyHtml = true,
                Subject = subject,
                Body = body,
                BodyEncoding = Encoding.UTF8
            };

            validRecipients.ToList().ForEach(x => mail.Bcc.Add(new MailAddress(x)));

            if (attachments.Count > 0)
                foreach (var attachment in attachments)
                {
                    var att = new Attachment(attachment.Stream, attachment.Ident.Ident.ToString(), attachment.MimeType);
                    att.ContentId = attachment.Ident.Ident.ToString();
                    att.Name = attachment.Name;
                    att.ContentDisposition.Inline = true;
                    att.ContentDisposition.DispositionType = DispositionTypeNames.Inline;
                    mail.Attachments.Add(att);
                }

            smtpClient.Send(mail);

            smtpClient.Dispose();
        }

        private HashSet<string> FilterInvalidMails(HashSet<string> recipients)
            => recipients.Where(recipient => recipient.IsValidEmail()).ToHashSet();
    }
}