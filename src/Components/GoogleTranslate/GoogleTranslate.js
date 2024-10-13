import React, { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleTranslate = () => {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () => setError("Failed to load Google Translate script");

      window.googleTranslateElementInit = () => {
        try {
          const elementId = "google_translate_element";
          console.log(document.getElementById(elementId)); // Kiểm tra xem phần tử có tồn tại không

          new window.google.translate.TranslateElement(
            {
              pageLanguage: "vi",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              includedLanguages: "en,fr,es,de,zh-CN,ja,ko",
            },
            elementId
          );
        } catch (err) {
          setError(`Failed to initialize Google Translate: ${err.message}`);
        }
      };

      document.body.appendChild(script);
    };

    loadGoogleTranslate();

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  if (error) {
    console.error(error);
    return <div>Error loading Google Translate: {error}</div>;
  }

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
