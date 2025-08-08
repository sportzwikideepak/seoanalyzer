// GSC Configuration for Multiple Properties
export const GSC_CONFIG = {
  // English Cricket Addictor
  english: {
    propertyUrl: "https://cricketaddictor.com",
    propertyName: "Cricket Addictor (English)",
    language: "en",
    apiEndpoint: "/api/gsc/en",
    databaseTable: "gsc_ai_recommendations",
    automationPrefix: "en_",
    displayName: "English"
  },
  
  // Hindi Cricket Addictor
  hindi: {
    propertyUrl: "https://hindi.cricketaddictor.com",
    propertyName: "Cricket Addictor (Hindi)",
    language: "hi",
    apiEndpoint: "/api/gsc/hi",
    databaseTable: "gsc_hindi_ai_recommendations",
    automationPrefix: "hi_",
    displayName: "Hindi"
  }
};

// Helper function to get config by language
export const getGSCConfig = (language = 'en') => {
  return GSC_CONFIG[language] || GSC_CONFIG.english;
};

// Helper function to get all available languages
export const getAvailableLanguages = () => {
  return Object.keys(GSC_CONFIG).map(key => ({
    code: key,
    ...GSC_CONFIG[key]
  }));
};

