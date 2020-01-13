import osLocale from 'os-locale';
import { LANGUAGE_LOCALES, FORMAT_LOCALES, DEFAULT_LANG, DEFAULT_FORMAT } from '../constants/constants';

// osLocale value has the format 'lang-country' (en-GB, en-US, es-ES, ...)
let _osLocalePromise = (async () => await osLocale())();

const guessLanguageLocale = function() {
  return _osLocalePromise.then(_osLocale => {
    _osLocale = _osLocale.toLowerCase();
    // Check if there is a translation available that matches lang and region
    const isLocaleFound = LANGUAGE_LOCALES.some(lang => lang.code === _osLocale);
    if (isLocaleFound) return _osLocale;
    
    // Check if there is a translation available that matches lang
    let language = _osLocale.split('-')[0];
    const isLanguageFound = LANGUAGE_LOCALES.some(lang => lang.code === language);
    if (isLanguageFound) return language;

    return DEFAULT_LANG;
  });  
}

const guessFormatLocale = function() {
  return _osLocalePromise.then(_osLocale => {
    _osLocale = _osLocale.toLowerCase();
    // Check if there is a format available that matches lang and region
    const isLocaleFound = FORMAT_LOCALES.some(format => format.code === _osLocale);
    if (isLocaleFound) return _osLocale;
    
    // Check if there is a format available that matches lang
    let langFormat = _osLocale.split('-')[0];
    const isLangFormat = FORMAT_LOCALES.some(format => format.code === langFormat);
    if (isLangFormat) return langFormat;

    return DEFAULT_FORMAT;
  });
}

export {
  guessLanguageLocale,
  guessFormatLocale
}