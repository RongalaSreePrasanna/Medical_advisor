import { Language, HealthcareCenter, OutbreakForecast, VaccineItem } from "./types";

// Translation dictionary for standard application headers, sections and alerts in multiple languages
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  English: {
    appTitle: "SwasthyaMitra",
    appSub: "Multilingual AI Rural Health Shield & Assistant",
    tabSymptoms: "Symptom Checker",
    tabVaccines: "Vaccination Tracker",
    tabOutbreaks: "Outbreak Alerts",
    tabCenters: "PHC Finder",
    tabASHA: "ASHA Worker Panel",
    tabMyths: "Myth vs Fact",
    langLabel: "Select Language / भाषा चुनें",
    userGreeting: "Welcome to SwasthyaMitra",
    voiceBtnListen: "Start Voice Recording",
    voiceBtnStop: "Stop Recording",
    voiceBtnListening: "Listening... speak now",
    imageUploadLabel: "Charge Photo of Symptom / Medicine (Optional)",
    imageProcessing: "Analyzing image...",
    severityLabel: "Risk Level",
    homeCareLabel: "Home Care Remedies",
    schemesLabel: "Recommended Indian Govt Schemes",
    redFlagsLabel: "Red Flags (Go to Hospital immediately if seen)",
    submitSymptoms: "Analyze Symptoms with AI Mitra",
    analyzingText: "Reading your request and visual indicators...",
    errEnterSymptoms: "Please write symptoms or record a voice input first, or upload a symptom photo.",
    disclaimerLabel: "Symptom Triage Disclaimer",
    govtRefLabel: "Official Health Reference",
    searchPHC: "Search Clinics in India (enter PIN or City)",
    vaccineAlertSim: "Simulated Mobile Alert Logs (SMS / WhatsApp)",
    ashaHouseholdHead: "Household Head Name",
    ashaVillageName: "Village Name",
    ashaFamilyCount: "Household Members Count",
    ashaRegisterBtn: "Register Household",
    ashaRegisteredList: "Registered Households Survey",
    mythInputPlaceholder: "Ask about a local medicine rumor or belief..."
  },
  Hindi: {
    appTitle: "स्वास्थ्यमित्र",
    appSub: "बहुभाषी एआई ग्रामीण स्वास्थ्य रक्षक और सहायक",
    tabSymptoms: "लक्षण जांच",
    tabVaccines: "टीकाकरण ट्रैकर",
    tabOutbreaks: "महामारी अलर्ट",
    tabCenters: "अस्पताल खोजें",
    tabASHA: "आशा कार्यकर्ता मोड",
    tabMyths: "अफवाह vs सच",
    langLabel: "भाषा चुनें",
    userGreeting: "स्वास्थ्यमित्र में आपका स्वागत है",
    voiceBtnListen: "आवाज रिकॉर्ड करना शुरू करें",
    voiceBtnStop: "रिकार्डिंग बंद करें",
    voiceBtnListening: "सुन रहा हूँ... अब बोलें",
    imageUploadLabel: "घाव/दवाई की फोटो अपलोड करें (वैकल्पिक)",
    imageProcessing: "फोटो की जांच हो रही है...",
    severityLabel: "जोखिम स्तर",
    homeCareLabel: "सुरक्षित घरेलू उपचार",
    schemesLabel: "अनुशंसित सरकारी योजनाएं",
    redFlagsLabel: "खतरे के लक्षण (दिखने पर तुरंत डॉक्टर के पास जाएं)",
    submitSymptoms: "एआई मित्र से लक्षण जांचें",
    analyzingText: "जांच जारी है, कृपया प्रतीक्षा करें...",
    errEnterSymptoms: "कृपया लक्षण लिखें, आवाज रिकॉर्ड करें या फोटो अपलोड करें।",
    disclaimerLabel: "चिकित्सा अस्वीकरण",
    govtRefLabel: "आधिकारिक सरकारी निर्देश",
    searchPHC: "पिन कोड या शहर डालकर नजदीकी क्लिनिक खोजें",
    vaccineAlertSim: "सिम्युलेटेड मोबाइल एसएमएस / व्हाट्सएप अलर्ट लॉग",
    ashaHouseholdHead: "मुखिया का नाम",
    ashaVillageName: "गाँव का नाम",
    ashaFamilyCount: "परिवार के सदस्यों की संख्या",
    ashaRegisterBtn: "नया परिवार पंजीकृत करें",
    ashaRegisteredList: "पंजीकृत परिवारों का सर्वेक्षण",
    mythInputPlaceholder: "किसी अंधविश्वास या अफवाह के बारे में पूछें..."
  },
  Marathi: {
    appTitle: "स्वास्थ्यमित्र",
    appSub: "बहुभाषिक एआय ग्रामीण आरोग्य रक्षक आणि सहाय्यक",
    tabSymptoms: "लक्षण तपासणी",
    tabVaccines: "लसीकरण ट्रॅकर",
    tabOutbreaks: "साथीचे आजार अलर्ट",
    tabCenters: "PHC शोधा",
    tabASHA: "आशा कार्यकर्ता मोड",
    tabMyths: "अफवा की खरी माहिती",
    langLabel: "भाषा निवडा",
    userGreeting: "स्वास्थ्यमित्र मध्ये आपले स्वागत आहे",
    voiceBtnListen: "आवाज रेकॉर्ड करा",
    voiceBtnStop: "रेकॉर्डिंग थांबवा",
    voiceBtnListening: "ऐकत आहे... आता बोला",
    imageUploadLabel: "लक्षण किंवा औषधाचा फोटो जोडा (पर्यायी)",
    imageProcessing: "फोटोचे विश्लेषण सुरू आहे...",
    severityLabel: "धोका पातळी",
    homeCareLabel: "सुरक्षित घरगुती उपचार",
    schemesLabel: "शिफारस केलेल्या सरकारी योजना",
    redFlagsLabel: "धोक्याची चिन्हे (त्वरित रुग्णालयात जा)",
    submitSymptoms: "एआय मित्राकडून लक्षणे तपासा",
    analyzingText: "आरोग्य तपासणी सुरू आहे, कृपया थांबा...",
    errEnterSymptoms: "कृपया लक्षणे लिहा, आवाज रेकॉर्ड करा किंवा फोटो अपलोड करा.",
    disclaimerLabel: "वैद्यकीय अस्वीकरण",
    govtRefLabel: "शासकीय संदर्भ",
    searchPHC: "पिन कोड किंवा शहर टाकून रुग्णालय शोधा",
    vaccineAlertSim: "सिम्युलेटेड एसएमएस / व्हॉट्सॲप अलर्ट लॉग",
    ashaHouseholdHead: "कुटुंब प्रमुखाचे नाव",
    ashaVillageName: "गावाचे नाव",
    ashaFamilyCount: "कुटुंबातील एकूण सदस्य",
    ashaRegisterBtn: "कुटुंबाची नोंदणी करा",
    ashaRegisteredList: "नोंदणीकृत कुटुंबांचे सर्वेक्षण",
    mythInputPlaceholder: "आरोग्याविषयीच्या अफवेबद्दल मोकळेपणाने विचारा..."
  },
  Tamil: {
    appTitle: "ஸ்வஸ்தியமித்ரா",
    appSub: "பல்லூடக ஏஐ கிராமப்புற சுகாதார காப்பாளர்",
    tabSymptoms: "அறிகுறி கண்டறிதல்",
    tabVaccines: "தடுப்பூசி டிராக்கர்",
    tabOutbreaks: "தொற்றுநோய் எச்சரிக்கை",
    tabCenters: "மருத்துவமனை தேடல்",
    tabASHA: "ஆஷா பணியாளர் பகுதி",
    tabMyths: "வதந்தியும் உண்மையும்",
    langLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
    userGreeting: "ஸ்வஸ்தியமித்ரா உங்களை வரவேற்கிறது",
    voiceBtnListen: "குரல் மூலம் உள்ளிடவும்",
    voiceBtnStop: "பதிவை நிறுத்தவும்",
    voiceBtnListening: "கேட்கிறது... இப்போது பேசவும்",
    imageUploadLabel: "அறிகுறி அல்லது மருந்துப் படம் (விரும்பினால்)",
    imageProcessing: "படம் பகுப்பாய்வு செய்யப்படுகிறது...",
    severityLabel: "ஆபத்து நிலை",
    homeCareLabel: "முதல் உதவி & வீட்டு வைத்தியம்",
    schemesLabel: "பரிந்துரைக்கப்படும் அரசு திட்டங்கள்",
    redFlagsLabel: "சிவப்பு எச்சரிக்கை (உடனே மருத்துவமனைக்குச் செல்ல வேண்டும்)",
    submitSymptoms: "ஏஐ மித்ரா மூலம் அறிகுறி கண்டறி",
    analyzingText: "விவரங்களை ஆராய்கிறது...",
    errEnterSymptoms: "தயவுசெய்து அறிகுறிகளை அளிக்கவும், குரல்பதிவு செய்யவும் அல்லது படம் பதிவேற்றவும்.",
    disclaimerLabel: "மருத்துவ மறுப்பு",
    govtRefLabel: "அரசு அங்கீகரிக்கப்பட்ட குறிப்பு",
    searchPHC: "பின்கோடு அல்லது ஊரைத் தட்டச்சு செய்து தேடுக",
    vaccineAlertSim: "மொபைல் எஸ்எம்எஸ் / வாட்ஸ்அப் அலர்ட் சிமுலேட்டர்",
    ashaHouseholdHead: "குடும்பத் தலைவர் பெயர்",
    ashaVillageName: "கிராமத்தின் பெயர்",
    ashaFamilyCount: "குடும்ப உறுப்பினர்கள் எண்ணிக்கை",
    ashaRegisterBtn: "குடும்பத்தை பதிவுசெய்",
    ashaRegisteredList: "பதிவுசெய்யப்பட்ட கிராமப்புற கணக்கெடுப்பு",
    mythInputPlaceholder: "உள்ளூர் வதந்தி அல்லது நம்பிக்கை பற்றி கேளுங்கள்..."
  },
  Telugu: {
    appTitle: "స్వస్థ్యమిత్ర",
    appSub: "బహుభాషా ఏఐ గ్రామీణ ఆరోగ్య సహాయకుడు",
    tabSymptoms: "లక్షణాల గుర్తింపు",
    tabVaccines: "టీకాల ట్రాకర్",
    tabOutbreaks: "అంటువ్యాధుల హెచ్చరిక",
    tabCenters: "వైద్య కేంద్రాలు",
    tabASHA: "ఆశా వర్కర్ మోడ్",
    tabMyths: "నిజాలు - అబద్ధాలు",
    langLabel: "భాష ఎంచుకోండి",
    userGreeting: "స్వస్థ్యమిత్రకు స్వాగతం",
    voiceBtnListen: "వాయిస్ రికార్డింగ్ ప్రారంభించండి",
    voiceBtnStop: "రికార్డింగ్ ఆపండి",
    voiceBtnListening: "వింటున్నాము... ఇప్పుడు మాట్లాడండి",
    imageUploadLabel: "లక్షణాలు లేదా మందుల ఫోటో పెట్టండి",
    imageProcessing: "ఫోటో విశ్లేషిస్తున్నాము...",
    severityLabel: "ప్రమాద తీవ్రత",
    homeCareLabel: "ఇంటి చిట్కాలు మరియు జాగ్రత్తలు",
    schemesLabel: "ప్రభుత్వ ఆరోగ్య పథకాలు",
    redFlagsLabel: "అత్యవసర ప్రమాద లక్షణాలు (వెంటనే ఆసుపత్రికి వెళ్ళండి)",
    submitSymptoms: "ఏఐ మిత్రతో పరీక్షించండి",
    analyzingText: "వివరాలు విశ్లేషిస్తున్నాము, వేచి ఉండండి...",
    errEnterSymptoms: "లక్షణాలు వ్రాయండి లేదా వాయిస్ రికార్డ్ చేయండి, లేదా ఫోటో పెట్టండి.",
    disclaimerLabel: "వైద్య నిరాకరణ ప్రకటన",
    govtRefLabel: "ప్రభుత్వ మార్గదర్శకాలు",
    searchPHC: "పిన్ కోడ్ లేదా ఊరు టైప్ చేసి ఆస్పత్రులను వెతకండి",
    vaccineAlertSim: "సిమ్యులేట్ చేసిన మొబైల్ వాట్సాప్/ఎస్ఎంఎస్ హెచ్చరికలు",
    ashaHouseholdHead: "కుటుంబ యజమాని పేరు",
    ashaVillageName: "గ్రామం పేరు",
    ashaFamilyCount: "కుటుంబ సభ్యుల సంఖ్య",
    ashaRegisterBtn: "కుటుంబ నమోదు చేయండి",
    ashaRegisteredList: "నమోదైన కుటుంబాల సర్వే వివరాలు",
    mythInputPlaceholder: "గ్రామీణ ప్రాంతాల్లో ప్రచారంలో ఉన్న వదంతుల గురించి అడగండి..."
  },
  Bengali: {
    appTitle: "স্বাস্থ্যমিত্র",
    appSub: "বহুভাষী এআই গ্রামীণ স্বাস্থ্য রক্ষা ও সহায়ক",
    tabSymptoms: "লক্ষণ পরীক্ষা",
    tabVaccines: "টিকা ট্র্যাকার",
    tabOutbreaks: "মহামারী সতর্কতা",
    tabCenters: "হাসপাতাল খুঁজুন",
    tabASHA: "আশা কর্মী মোড",
    tabMyths: "গুজব বনাম সত্য",
    langLabel: "ভাষা নির্বাচন করুন",
    userGreeting: "স্বাস্থ্যমিত্রে আপনাকে স্বাগত",
    voiceBtnListen: "কণ্ঠস্বর রেকর্ড শুরু করুন",
    voiceBtnStop: "রেকর্ডিং বন্ধ করুন",
    voiceBtnListening: "শুনছি... এখন বলুন",
    imageUploadLabel: "ক্ষতচিহ্ন বা ওষুধের ছবি আপলোড করুন (ঐচ্ছিক)",
    imageProcessing: "ছবি পরীক্ষা করা হচ্ছে...",
    severityLabel: "ঝুঁকির মাত্রা",
    homeCareLabel: "নিরাপদ ঘরোয়া প্রতিকার",
    schemesLabel: "অনুমোদিত সরকারি প্রকল্পসমূহ",
    redFlagsLabel: "বিপদের লক্ষণ (তৎক্ষণাৎ হাসপাতালে যান)",
    submitSymptoms: "এআই মিত্রের সাথে লক্ষণ পরীক্ষা করুন",
    analyzingText: "বিশ্লেষণ করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...",
    errEnterSymptoms: "অনুগ্রহ করে লক্ষণ লিখুন, ভয়েস রেকর্ড করুন বা ছবি আপলোড করুন।",
    disclaimerLabel: "চিকিৎসা সংক্রান্ত দাবিত্যাগ",
    govtRefLabel: "সরকারি নির্দেশাবলী",
    searchPHC: "পিন কোড বা শহর দিয়ে ক্লিনিক খুঁজুন",
    vaccineAlertSim: "সিমুলেটেড মোবাইল এসএমএস / হোয়াটসঅ্যাপ এলার্ট লগ",
    ashaHouseholdHead: "পরিবারের প্রধানের নাম",
    ashaVillageName: "গ্রামের নাম",
    ashaFamilyCount: "পরিবারের সদস্য সংখ্যা",
    ashaRegisterBtn: "পরিবার নিবন্ধন করুন",
    ashaRegisteredList: "নিবন্ধিত গ্রামীণ পরিবার তালিকা",
    mythInputPlaceholder: "কোনো স্বাস্থ্য গুজব বা অন্ধবিশ্বাস সম্পর্কে জিজ্ঞাসা করুন..."
  },
  Kannada: {
    appTitle: "ಸ್ವಸ್ಥ್ಯಮಿತ್ರ",
    appSub: "ಬಹುಭಾಷಾ ಎಐ ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ರಕ್ಷಕ ಮತ್ತು ಸಹಾಯಕ",
    tabSymptoms: "ಲಕ್ಷಣ ತಪಾಸಣೆ",
    tabVaccines: "ಲಸಿಕೆ ಟ್ರ್ಯಾಕರ್",
    tabOutbreaks: "ಸಾಂಕ್ರಾಮಿಕ ರೋಗ ಎಚ್ಚರಿಕೆ",
    tabCenters: "ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ",
    tabASHA: "ಆಶಾ ಕಾರ್ಯಕರ್ತೆ ಮೋಡ್",
    tabMyths: "ಅಪನಂಬಿಕೆ vs ಸತ್ಯ",
    langLabel: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    userGreeting: "ಸ್ವಸ್ಥ್ಯಮಿತ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ",
    voiceBtnListen: "ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ",
    voiceBtnStop: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    voiceBtnListening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    imageUploadLabel: "ಗಾಯ ಅಥವಾ ಲಕ್ಷಣದ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)",
    imageProcessing: "ಚಿತ್ರ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    severityLabel: "ಅಪಾಯದ ಪ್ರಮಾಣ",
    homeCareLabel: "ಸುರಕ್ಷಿತ ಮನೆಮದ್ದುಗಳು",
    schemesLabel: "ಶಿಫಾರಸು ಮಾಡಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    redFlagsLabel: "ಅಪಾಯಕಾರಿ ಲಕ್ಷಣಗಳು (ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ಕೊಡಿ)",
    submitSymptoms: "ಎಐ ಮಿತ್ರ ಮೂಲಕ ಪರೀಕ್ಷಿಸಿ",
    analyzingText: "ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ಕಾಯಿರಿ...",
    errEnterSymptoms: "ದಯವಿಟ್ಟು ಲಕ್ಷಣಗಳನ್ನು ಮಾಹಿತಿ ನೀಡಿ, ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ ಅಥವಾ ಫೋಟೋ ಹಾಕಿ.",
    disclaimerLabel: "ವೈದ್ಯಕೀಯ ಹಕ್ಕುತ್ಯಾಗ",
    govtRefLabel: "ಸರ್ಕಾರಿ ಅಧಿಕೃತ ಮಾಹಿತಿ",
    searchPHC: "ಪಿನ್ ಕೋಡ್ ಅಥವಾ ಊರು ಹಾಕಿ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ",
    vaccineAlertSim: "ಸಿಮ್ಯుಲೇಟ್ ಮಾಡಲಾದ ಮೊಬೈಲ್ ಎಸ್ಎಂಎಸ್ ಹೆಚ್ಚರಿಕೆ ಡೈರಿ",
    ashaHouseholdHead: "ಮನೆಯ ಯಜಮಾನನ ಹೆಸರು",
    ashaVillageName: "ಹಳ್ಳಿಯ ಹೆಸರು",
    ashaFamilyCount: "ಕುಟುಂಬ ಸದಸ್ಯರ ಸಂಖ್ಯೆ",
    ashaRegisterBtn: "ಕುಟುಂಬ ನೋಂದಣಿ ಮಾಡಿ",
    ashaRegisteredList: "ನೋಂದಾಯಿತ ಕುಟುಂಬಗಳ ಆರೋಗ್ಯ ಸರ್ವೇ",
    mythInputPlaceholder: "ಯಾವುದೇ ಆರೋಗ್ಯ ಪ್ರಚಾರದ ಸುಳ್ಳು ಸುದ್ದಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ..."
  }
};

// 2. Pre-defined Indian child vaccine schedule for tracking
export const STANDARD_VACCINES: Omit<VaccineItem, "status">[] = [
  { id: "v1", name: "BCG Vaccine", recommendedAge: "At Birth", ageWeeks: 0, description: "Protects child against severe tuberculosis (TB)." },
  { id: "v2", name: "Hepatitis B - 1st", recommendedAge: "At Birth", ageWeeks: 0, description: "Protects against dangerous liver infections." },
  { id: "v3", name: "Polio Drops (OPV-0)", recommendedAge: "At Birth", ageWeeks: 0, description: "Critical protection against irreversible child paralysis." },
  { id: "v4", name: "Pentavalent - 1st", recommendedAge: "6 Weeks", ageWeeks: 6, description: "Combined vaccine for Diphtheria, Pertussis, Tetanus, Hepatitis B, and Hib pneumonia." },
  { id: "v5", name: "Rotavirus - 1st", recommendedAge: "6 Weeks", ageWeeks: 6, description: "Prevents fatal diarrhea/dehydration in infanthood." },
  { id: "v6", name: "Polio Drops (OPV-1)", recommendedAge: "6 Weeks", ageWeeks: 6, description: "First routine polio dosage drops orally." },
  { id: "v7", name: "Pentavalent - 2nd", recommendedAge: "10 Weeks", ageWeeks: 10, description: "Second dosage of combined protection." },
  { id: "v8", name: "Rotavirus - 2nd", recommendedAge: "10 Weeks", ageWeeks: 10, description: "Second dosage protection against diarrhoea." },
  { id: "v9", name: "Pentavalent - 3rd", recommendedAge: "14 Weeks", ageWeeks: 14, description: "Third mandatory dosage for strong anti-pathogen shield." },
  { id: "v10", name: "Polio Drops (OPV-3)", recommendedAge: "14 Weeks", ageWeeks: 14, description: "Third polio dosage drops." },
  { id: "v11", name: "Measles & Rubella (MR) - 1st", recommendedAge: "9 Months", ageWeeks: 36, description: "Shields child from dangerous skin rashes, high fever outbreaks, and birth defects." },
  { id: "v12", name: "Vitamin A - 1st Dose", recommendedAge: "9 Months", ageWeeks: 36, description: "Prevents child blindness and strengthens general body immunity." },
  { id: "v13", name: "DPT Booster - 1st", recommendedAge: "16-24 Months", ageWeeks: 72, description: "Boosts ongoing security against Diphtheria, Whooping Cough, Tetanus." }
];

// Pre-defined pregnant maternal vaccine plan
export const MATERNAL_VACCINES: Omit<VaccineItem, "status">[] = [
  { id: "m1", name: "Tetanus Toxoid (TT-1)", recommendedAge: "Early Pregnancy", ageWeeks: 4, description: "Prevents fatal lockjaw tetanus infections in mother and child." },
  { id: "m2", name: "Tetanus Toxoid (TT-2)", recommendedAge: "4 Weeks after TT-1", ageWeeks: 8, description: "Second booster protection before labor." },
  { id: "m3", name: "Influenza Vaccine", recommendedAge: "Second Trimester", ageWeeks: 16, description: "Protects expecting mother against high flu fever." },
  { id: "m4", name: "Tdap Vaccine", recommendedAge: "27-36 Weeks", ageWeeks: 30, description: "Protects baby against whooping cough right during infancy." }
];

// 3. Simulated Outbreak Forecast data for major Indian semi-urban regions
export const OUTBREAK_FORECASTS: OutbreakForecast[] = [
  {
    region: "Pune Area (Maharashtra)",
    dengueRisk: "High",
    malariaRisk: "Medium",
    heatstrokeRisk: "Low",
    weeklyRiskTrend: [30, 45, 65, 80, 85], // Dengue trend spike
    alertMessage: "Dengue risk elevated spike detected in Pune suburbs due to stagnant water accumulation following early monsoon showers. Clean immediate water coolers and wear full sleeves."
  },
  {
    region: "Patna Region (Bihar)",
    dengueRisk: "Medium",
    malariaRisk: "High",
    heatstrokeRisk: "High",
    weeklyRiskTrend: [50, 60, 75, 82, 90], // Heat wave + malaria mosquito breeding
    alertMessage: "Extreme heat warning (+44°C) with water levels shrinking, and increased breeding of mosquitoes in Bihar rural pockets. Prepare Oral Rehydration Solution (ORS) at home and avoid direct sun after 11 AM."
  },
  {
    region: "Coimbatore District (Tamil Nadu)",
    dengueRisk: "Low",
    malariaRisk: "Medium",
    heatstrokeRisk: "Medium",
    weeklyRiskTrend: [20, 25, 23, 28, 30], // Stable trend
    alertMessage: "Water levels and humidity are moderately normal. Safe vaccination cover is strongly advised."
  },
  {
    region: "Medinipur Suburbs (West Bengal)",
    dengueRisk: "High",
    malariaRisk: "High",
    heatstrokeRisk: "Low",
    weeklyRiskTrend: [40, 55, 63, 72, 85], // Heavy flooding risk
    alertMessage: "High Risk alerts for Vector-borne Malaria in Medinipur district. Sleep inside insecticide-treated mosquito nets (Medicinal Bednets) and immediately seek clinic if high fever starts."
  },
  {
    region: "Raichur Rural (Karnataka)",
    dengueRisk: "Medium",
    malariaRisk: "Low",
    heatstrokeRisk: "High",
    weeklyRiskTrend: [45, 55, 70, 85, 80],
    alertMessage: "Severe arid heat stroke alerts in Raichur rural. Village drinking water wells must be chlorinated. Boil drinking water before offering to infants."
  }
];

// 4. Genuine Indian local healthcare Centers catalogued by PIN codes
export const INDIAN_HEALTHCARE_CENTERS: HealthcareCenter[] = [
  // Maharashtra (Pune Area)
  {
    name: "Uruli Kanchan Primary Health Center (PHC)",
    type: "PHC",
    pinCode: "412202",
    city: "Pune",
    state: "Maharashtra",
    distance: "1.2 km",
    phone: "+91 2112 255102",
    services: ["Maternal Care", "Free Infant Vaccination", "Malaria Smear Test", "Generic Pharmacy"],
    bedCount: 6
  },
  {
    name: "Loni Kalbhor Rural Government Hospital",
    type: "Government Hospital",
    pinCode: "412201",
    city: "Pune",
    state: "Maharashtra",
    distance: "5.4 km",
    phone: "+91 2112 284305",
    services: ["24/7 Emergency", "Major Surgeries", "Vaccine Cold Chain Store", "Delivery Ward"],
    bedCount: 30
  },

  // Bihar (Patna Region)
  {
    name: "Phulwari Sharif Sub-District Welfare Clinic",
    type: "PHC",
    pinCode: "801505",
    city: "Patna",
    state: "Bihar",
    distance: "0.8 km",
    phone: "+91 612 2452201",
    services: ["BCG & MR Immunization", "OPD consult", "Ayushman Gold Card center", "Nutritional checkup"],
    bedCount: 4
  },
  {
    name: "Patna Sadar Government Hospital Sub-Unit",
    type: "Government Hospital",
    pinCode: "800001",
    city: "Patna",
    state: "Bihar",
    distance: "3.1 km",
    phone: "+91 612 2301021",
    services: ["24-Hour Trauma Care", "Critical Care ICU", "Ayushman Bharat PM-JAY treatment approvals"],
    bedCount: 120
  },

  // Tamil Nadu (Coimbatore District)
  {
    name: "Thondamuthur Primary Health Center",
    type: "Vaccination Center",
    pinCode: "641109",
    city: "Coimbatore",
    state: "Tamil Nadu",
    distance: "2.0 km",
    phone: "+91 422 2617202",
    services: ["Pentavalent Vaccine Stock", "Pregnancy TT boosters", "Siddha and Ayush Clinic", "Water Quality Tests"],
    bedCount: 8
  },
  {
    name: "Coimbatore Government Medical College Hospital",
    type: "Emergency Unit",
    pinCode: "641018",
    city: "Coimbatore",
    state: "Tamil Nadu",
    distance: "8.1 km",
    phone: "+91 422 2301300",
    services: ["Multispecialty Care", "Neonatal Emergency Unit", "Snakebite Venom Antisera", "Modern Lab"],
    bedCount: 800
  },

  // West Bengal (Medinipur Area)
  {
    name: "Daspur Primary Village Health Block",
    type: "PHC",
    pinCode: "721211",
    city: "Medinipur",
    state: "West Bengal",
    distance: "2.5 km",
    phone: "+91 3225 254101",
    services: ["Maternity Delivery", "Oral Rehydration and Malaria test", "Free medicines dispenser"],
    bedCount: 5
  },
  {
    name: "Midnapore District Sadar Hospital",
    type: "Government Hospital",
    pinCode: "721101",
    city: "Medinipur",
    state: "West Bengal",
    distance: "6.8 km",
    phone: "+91 3222 274102",
    services: ["24/7 Casualty", "Blood Bank", "Pediatric Surgery", "National Health Mission support"],
    bedCount: 350
  },

  // Karnataka (Raichur Area)
  {
    name: "Gabbur Gram Panchayat PHC Center",
    type: "PHC",
    pinCode: "584113",
    city: "Raichur",
    state: "Karnataka",
    distance: "1.5 km",
    phone: "+91 8532 240105",
    services: ["Heat Stroke ORS ward", "Childhood Immunisations", "Nutritional Supplement Distribution"],
    bedCount: 6
  }
];

// Preloaded famous health myths vs scientific facts for immediate validation
export interface LocalMythObj {
  id: string;
  mythEn: string;
  mythLocal: string;
  factEn: string;
  factLocal: string;
}

export const PRE_LOADED_MYTHS: LocalMythObj[] = [
  {
    id: "m_1",
    mythEn: "Do vaccinations make children infertile when they grow up?",
    mythLocal: "क्या टीकाकरण से बड़े होने पर बच्चे नपुंसक हो जाते हैं?",
    factEn: "No. Extensive medical research proves vaccinations have absolutely zero connection to infertility. They only protect children from mortal infections like Polio, measles, and pneumonia.",
    factLocal: "नहीं। वैज्ञानिक शोधों से सिद्ध हुआ है कि टीकों का बांझपन से कोई संबंध नहीं है। वे केवल बच्चों को पोलियो, खसरा और निमोनिया जैसी घातक बीमारियों से सुरक्षित रखते हैं।"
  },
  {
    id: "m_2",
    mythEn: "Does eating garlic or neem cure Malaria and Dengue fever completely?",
    mythLocal: "क्या लहसुन या नीम खाने से मलेरिया और डेंगू पूरी तरह ठीक हो जाता है?",
    factEn: "No. Garlic and neem have healthy herbal properties, but they cannot kill the dangerous Plasmodium parasite or raise platelets count for Dengue. Seek clinical test immediately.",
    factLocal: "नहीं। लहसुन या नीम सेहतमंद होते हैं, लेकिन ये मलेरिया के परजीवी या डेंगू वायरस को ख़त्म नहीं कर सकते। रक्त परीक्षण और डॉक्टर की सलाह ज़रूरी है।"
  },
  {
    id: "m_3",
    mythEn: "Should commercial baby formula act as a replacement for colostrum (mother's first yellow milk)?",
    mythLocal: "क्या पूरक शिशु आहार मां के पहले गाढ़े पीले दूध (कोलेस्ट्रम) की जगह ले सकता है?",
    factEn: "Absolutely false. The first yellow milk contains vital custom antibodies that act as the infant's first natural safe vaccine block. Do not discard it.",
    factLocal: "बिल्कुल गलत। मां का पहला गाढ़ा पीला दूध (कोलेस्ट्रम) शिशु के लिए अमृत समान पहला प्राकृतिक टीका होता है, जो उसे संक्रमण से असीम सुरक्षा देता है।"
  }
];
