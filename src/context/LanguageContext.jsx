/* Abi Bhaskara copyright 2025 */
import { createContext, useContext, useState, useCallback } from 'react';

// Google Translate API (free endpoint)
const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

const LanguageContext = createContext({
    language: 'id',
    setLanguage: () => { },
    translateText: async () => '',
    isTranslating: false
});

// Translation cache to avoid re-translating
const translationCache = new Map();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('id');
    const [isTranslating, setIsTranslating] = useState(false);

    // Translate text from Indonesian to English
    const translateText = useCallback(async (text) => {
        if (!text || language === 'id') return text;

        // Check cache first
        const cacheKey = `${text.substring(0, 100)}`;
        if (translationCache.has(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        try {
            setIsTranslating(true);
            const url = `${TRANSLATE_API}?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();

            // Extract translated text from response
            let translated = '';
            if (data && data[0]) {
                translated = data[0].map(item => item[0]).join('');
            }

            // Cache the result
            translationCache.set(cacheKey, translated || text);
            return translated || text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        } finally {
            setIsTranslating(false);
        }
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translateText, isTranslating }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
