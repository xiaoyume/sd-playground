import React from 'react';
import useI18n from '../i18n/useI18n';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="language-switcher">
      <button
        className={locale === 'en' ? 'active' : ''}
        onClick={() => setLocale('en')}
      >
        {t.language.en}
      </button>
      <button
        className={locale === 'zh' ? 'active' : ''}
        onClick={() => setLocale('zh')}
      >
        {t.language.zh}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
