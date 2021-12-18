using System;
using API.BLL.Extensions;

namespace API.BLL.Base
{
    public abstract class IdentBase : IComparable<IdentBase>
    {
        public static T New<T>() where T : IdentBase
        {
            return Guid.NewGuid().Ident<T>();
        }

        public override int GetHashCode()
        {
            return Ident.GetHashCode();
        }

        public IdentBase(Guid ident)
        {
            Ident = ident;
        }

        public Guid Ident { get; }

        public T ToIdent<T>() where T : IdentBase => Ident.ToIdent<T>();

        public int CompareTo(IdentBase ident)
        {
            return Ident.CompareTo(ident.Ident);
        }

        public int CompareTo(Guid ident)
        {
            return Ident.CompareTo(ident);
        }

        public override string ToString()
        {
            return Ident.ToString();
        }

        public static bool operator ==(IdentBase a, IdentBase b)
        {
            if (ReferenceEquals(a, b))
            {
                return true;
            }

            if (((object) a == null) || ((object) b == null))
            {
                return false;
            }

            if (a.GetType() != b.GetType())
            {
                return false;
            }

            return a.Ident == b.Ident;
        }

        public static bool operator !=(IdentBase a, IdentBase b)
        {
            return !(a == b);
        }

        public static bool operator ==(IdentBase a, Guid b)
        {
            if ((object) a == null)
            {
                return false;
            }

            return a.Ident == b;
        }

        public static bool operator !=(IdentBase a, Guid b)
        {
            return !(a == b);
        }

        public static bool operator ==(Guid a, IdentBase b)
        {
            if ((object) b == null)
            {
                return false;
            }

            return a == b.Ident;
        }

        public static bool operator !=(Guid a, IdentBase b)
        {
            return !(a == b);
        }

        public override bool Equals(object obj)
        {
            var other = obj as IdentBase;
            if (other == null)
            {
                return false;
            }

            return Ident == other.Ident;
        }
    }
}