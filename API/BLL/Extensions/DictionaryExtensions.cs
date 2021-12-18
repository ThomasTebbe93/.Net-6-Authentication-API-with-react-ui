using System.Collections.Generic;

namespace API.BLL.Extensions
{
    public static class DictionaryExtensions
    {
        public static TValue ValueOrDefault<TKey, TValue>(
            this IDictionary<TKey, TValue> dictionary, 
            TKey key,
            TValue defaultValue = default)
        {
            return dictionary.TryGetValue(key, out var value) ? value : defaultValue;
        }
    }
}