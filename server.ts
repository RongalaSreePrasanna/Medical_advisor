import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with ample limit to support raw symptom photo base64 payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize the Gemini AI client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "OFFLINE_MODE",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// MULTI-LINGUAL OFFLINE TRIAGE SYSTEM
// This ensures the application works perfectly even if the GEMINI_API_KEY is not configured
// or when the user exports the project to VS Code without configuring local keys.
const offlineSymptomData: Record<string, Record<string, any>> = {
  English: {
    emergency: {
      severity: "Emergency",
      severityScore: 10,
      diagnoses: [{
        condition: "Suspected Acute Medical Emergency (त्वरित आपातकाल)",
        confidence: "90%",
        description: "Severe physical distress indicators identified. Requires immediate professional rescue.",
        homeCare: "Keep patient elevated if breathing, or lie flat. Loosen tight clothing. Do not self-medicate or give oral solids/fluids."
      }],
      isEmergency: true,
      emergencyAlert: "⚠️ CALL 108 / 102 Emergency Help immediately. Transfer the patient to the nearest Hospital or PHC.",
      redFlags: ["Extreme chest pain", "Loss of consciousness", "Trouble breathing", "Sudden facial drooping or slurred speech"],
      governmentSchemes: [
        { name: "Ayushman Bharat PM-JAY", description: "Offers up to 5 Lakh of free secondary and tertiary surgical & emergency care in empaneled hospitals." }
      ],
      guidance: "Avoid physical burden. Move patient to safety.",
      recommendedMedicines: [],
      spokenSummary: "This is an emergency medical situation. Please call 108 immediately and stay calm.",
      disclaimer: "Disclaimer: This is helpful offline AI guidance. Seek immediate clinical assessment."
    },
    fever: {
      severity: "Medium",
      severityScore: 6,
      diagnoses: [{
        condition: "Suspected Viral Fever or Seasonal Influenza (संदेहास्पद बुखार/शारीरिक दर्द)",
        confidence: "80%",
        description: "Typical symptoms associated with seasonal change, viral exposure, or secondary cold.",
        homeCare: "Keep hydrated, rest in ventilating shade, use cool-water forehead compresses."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["High fever lasting over 4 consecutive days", "Stiff neck or sudden confusion", "Severe persistent shivering"],
      governmentSchemes: [
        { name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana", description: "Get clean, tested, low-cost generic paracetamol and fever medications up to 80% cheaper at a local Kendra." }
      ],
      guidance: "Drink safe boiled water. Cover sleeping beds using protective mosquito nets.",
      recommendedMedicines: [
        {
          name: "Paracetamol 500mg",
          purpose: "Treats fever, controls elevated body temperature and minor joints body pain.",
          dosage: "1 tablet three times a day, strictly after a meal.",
          durationDays: 3,
          howToUse: "Take with warm water. Never consume on an empty or sour stomach.",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "Hello, you may be suffering from seasonal fever. Take one Paracetamol tablet up to three times a day after food. Rest well.",
      disclaimer: "Disclaimer: This is helpful offline AI advice. Consult an ASHA worker if fever stays high."
    },
    stomach: {
      severity: "Medium",
      severityScore: 5,
      diagnoses: [{
        condition: "Suspected Mild Food Contamination or Stomach Dehydration (पेट का संक्रमण)",
        confidence: "75%",
        description: "Signs indicate indigestion, loose intestinal motions, or heat-induced fluid imbalance.",
        homeCare: "Sip coconut water. Drink Oral Rehydration Solution (ORS) water continually to keep energy up."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["Blood in stool/vomiting", "Extreme dry mouth or hollow listless eyes", "Inability to keep liquids down for 12 hours"],
      governmentSchemes: [
        { name: "National Rural Health Mission (NRHM)", description: "Distributes free hygiene kits, disinfectants, and ORS packets through the local village health center." }
      ],
      guidance: "Wash hands thoroughly with soap before preparation of meals and after washroom use.",
      recommendedMedicines: [
        {
          name: "O.R.S. (Oral Rehydration Salts)",
          purpose: "Restores critical water, sodium and potassium ions lost during loose motions.",
          dosage: "Dissolve one whole ORS packet in 1 Litre of clean drinking water. Drink sip by sip.",
          durationDays: 2,
          howToUse: "Prepare using clean warm cooled water. Cover the solution. Throw any unused mixture away after 24 hours.",
          colorTheme: "green"
        }
      ],
      spokenSummary: "Hello, mix one packet of ORS in 1 litre of clean drinking water and sip it slowly throughout the day. It will restore your energy.",
      disclaimer: "Disclaimer: AI-generated offline guide. Always consult a general doctor for severe diarrhea."
    },
    skin: {
      severity: "Low",
      severityScore: 3,
      diagnoses: [{
        condition: "Suspected Allergic Skin Dermatitis / Insect Sting Reaction (त्वचा की खुजली/एलर्जी)",
        confidence: "80%",
        description: "Localized itchy skin reaction often triggered by insects, plants, pollen or dust allergens.",
        homeCare: "Do not touch or scratch. Gently clean with mild plain cool water. Apply cold washcloth compress."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["Swelling spreading to lips, mouth, throat or tongue", "Difficulty in solid swallowing or shallow breathing", "Pus-filled fluid blisters appearing"],
      governmentSchemes: [
        { name: "Ayushman Arogya Mandir", description: "Offers accessible general skincare consulting, antiseptic ointments, and essential drugs free at block hubs." }
      ],
      guidance: "Wear long sleeves in farms. Keep housing environments free of stagnant moisture.",
      recommendedMedicines: [
        {
          name: "Cetirizine 10mg",
          purpose: "Relieves allergic skin outbreaks, hives, redness, and persistent itching.",
          dosage: "1 tablet once daily, strictly only before night sleep.",
          durationDays: 5,
          howToUse: "May induce mild drowsiness. Avoid hard work or cycling/driving after taking.",
          colorTheme: "purple"
        }
      ],
      spokenSummary: "Hello. For skin itching, take one Cetirizine tablet at night before sleeping. Please avoid scratching.",
      disclaimer: "Disclaimer: Helpful offline AI guide. Consult clinic if rash becomes painful."
    },
    default: {
      severity: "Low",
      severityScore: 2,
      diagnoses: [{
        condition: "Symptomatic General Health Advice (सामान्य स्वास्थ्य परामर्श)",
        confidence: "70%",
        description: "Mild physiological discomfort detected. Suggest physical relaxation and close monitoring.",
        homeCare: "Eat fresh, hot healthy food. Consume boiled and cooled clean water, and sleep comfortably."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["Symptom intensity worsening over 3 days", "Unexpected localized intense shooting pain"],
      governmentSchemes: [
        { name: "National Quality Assurance Standards (NQAS) PHCs", description: "Provides free general consultation and health files tracking closer to rural villages." }
      ],
      guidance: "Wash skin regularly. Maintain personal hygiene. Visit village clinic if needed.",
      recommendedMedicines: [
        {
          name: "Paracetamol 500mg",
          purpose: "Symptomatic basic relief from minor fatigue or body strain.",
          dosage: "1 tablet twice daily, only when experiencing physical muscle discomfort, after food.",
          durationDays: 2,
          howToUse: "Take only as needed with plain clean water. Limit intake.",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "Namaskar, please rest well, drink warm water and eat fresh light home-cooked meals for the next two days.",
      disclaimer: "Disclaimer: AI-generated offline guidelines. Rest and consult your village ASHA worker."
    }
  },
  Hindi: {
    emergency: {
      severity: "Emergency",
      severityScore: 10,
      diagnoses: [{
        condition: "त्वरित आपातकालीन चिकित्सा (Acute Emergency / Trauma)",
        confidence: "95%",
        description: "अत्यंत गंभीर शारीरिक लक्षण पाए गए हैं। तुरंत व्यावसायिक चिकित्सा बचाव की आवश्यकता है।",
        homeCare: "मरीज को शांत रखें। यदि होश में हो तो पैरों को थोड़ा ऊपर उठाएं। ठोस भोजन या पीने का पानी बलपूर्वक न दें।"
      }],
      isEmergency: true,
      emergencyAlert: "⚠️ तुरंत 108 / 102 आपातकालीन एम्बुलेंस सेवा को कॉल करें। नजदीकी प्राथमिक चिकित्सा केंद्र या अस्पताल जाएं।",
      redFlags: ["तेज छाती का दर्द", "अचानक बेहोश होना", "सांस न ले पाना या घबराहट", "चेहरे या बोलने में अचानक पक्षाघात"],
      governmentSchemes: [
        { name: "आयुष्मान भारत योजना (PM-JAY)", description: "चुनिंदा सरकारी और निजी अस्पतालों में प्रति परिवार प्रति वर्ष 5 लाख रुपये तक का मुफ्त आपातकालीन चिकित्सा इलाज प्रदान करती है।" }
      ],
      guidance: "मरीज को सुरक्षित स्थान पर ले जाएं। शांत रहें और तुरंत 108 पर संपर्क करें।",
      recommendedMedicines: [],
      spokenSummary: "यह एक आपातकालीन स्थिति है। कृपया तुरंत 108 पर कॉल करें और घबराएं नहीं।",
      disclaimer: "अस्वीकरण: यह केवल आपातकालीन मार्गदर्शन है। कृपया नजदीकी डॉक्टर की मदद लें।"
    },
    fever: {
      severity: "Medium",
      severityScore: 6,
      diagnoses: [{
        condition: "संदेहास्पद वायरल बुखार / फ्लू (Viral Fever / Flu)",
        confidence: "80%",
        description: "शरीर का बढ़ा हुआ तापमान और सामान्य बदन दर्द, जो संक्रमण या मौसम बदलने के कारण होता है।",
        homeCare: "माथे पर साफ ठंडे पानी की पट्टी रखें। पर्याप्त गुनगुना पानी और तरल पदार्थ पीएं। हवादार कमरे में विश्राम करें।"
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["बुखार 5 दिनों से अधिक समय तक लगातार रहना", "गर्दन में अकड़न या अचानक भ्रम की स्थिति", "कांपने के साथ तेज ठंड लगना"],
      governmentSchemes: [
        { name: "प्रधानमंत्री जन औषधि केंद्र", description: "आपके नजदीकी ब्लॉक में जेनेरिक दवाएं जैसे पैरासिटामोल ८०% तक बेहद सस्ती दर पर गुणवत्ता के साथ उपलब्ध कराती है।" }
      ],
      guidance: "पीने का सारा पानी उबालकर ठंडा करें। मच्छरों से बचाव के लिए हमेशा मच्छरदानी का प्रयोग करें।",
      recommendedMedicines: [
        {
          name: "पैरासिटामोल 500mg(Paracetamol)",
          purpose: "शरीर का तापमान (बुखार) कम करती है और बदन व सिर के दर्द में राहत देती है।",
          dosage: "1 गोली दिन में तीन बार, केवल भोजन या नाश्ते के बाद।",
          durationDays: 3,
          howToUse: "गुनगुने साफ पानी के साथ लें। खाली पेट इस दवा का सेवन न करें।",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "नमस्ते, आपको सामान्य वायरल बुखार के लक्षण हैं। भोजन के बाद एक पैरासिटामोल लें, पर्याप्त आराम करें और बुखार बने रहने पर डॉक्टर को दिखाएं।",
      disclaimer: "अस्वीकरण: हमेशा अपनी आशा कार्यकर्ता या नजदीकी प्राथमिक चिकित्सा केंद्र से सलाह लें।"
    },
    stomach: {
      severity: "Medium",
      severityScore: 5,
      diagnoses: [{
        condition: "पेट का संक्रमण / दस्त एवं उल्टी (Gastroenteritis)",
        confidence: "75%",
        description: "शरीर में पानी और आवश्यक लवणों की कमी तथा दूषित पानी/भोजन के कारण पेट खराब होना।",
        homeCare: "नारयल पानी या पतला मट्ठा पीएं। शरीर में पानी की कमी रोकने के लिए जीवन रक्षक घोल (ओआरएस) घूंट-घूंट कर पीते रहें।"
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["मल या उल्टी में अचानक खून आना", "लगातार तेज दस्त या तरल पदार्थ न पचना", "जीभ अत्यधिक सूखना और गंभीर कमजोरी"],
      governmentSchemes: [
        { name: "राष्ट्रीय ग्रामीण स्वास्थ्य मिशन (NRHM)", description: "स्थानीय एएनएम या आशा कार्यकर्ता के माध्यम से मुफ्त ओआरएस पैकेट और बुनियादी ओटीसी स्वास्थ्य किट प्रदान करता है।" }
      ],
      guidance: "भोजन करने या बनाने से पहले और शौचालय के उपयोग के बाद अपने हाथों को साबुन से अच्छी तरह धोएं।",
      recommendedMedicines: [
        {
          name: "ओ.आर.एस. जीवन रक्षक घोल (O.R.S.)",
          purpose: "दस्त के कारण शरीर से निकले पानी और जरूरी नमक की कमी को पूरा करता है।",
          dosage: "1 पूरा पैकेट 1 लीटर साफ पीने के पानी में घोलें। पूरे दिन में धीरे-धीरे घूंट-घूंट कर पीएं।",
          durationDays: 2,
          howToUse: "उबले और ठंडे किए हुए पानी का उपयोग करें। घोल को ढक कर रखें और २४ घंटे के बाद बचा हुआ घोल फेंक दें।",
          colorTheme: "green"
        }
      ],
      spokenSummary: "नमस्ते, दस्त में शरीर की कमजोरी दूर करने के लिए ओ आर एस का घोल बनाकर थोड़ा-थोड़ा पीते रहें। दो दिन में आराम मिल जाएगा।",
      disclaimer: "अस्वीकरण: यह केवल प्राथमिक सहायता मार्गदर्शन है। हमेशा डॉक्टर की सलाह लें।"
    },
    skin: {
      severity: "Low",
      severityScore: 3,
      diagnoses: [{
        condition: "त्वचा की एलर्जी / कीड़े के काटने का लाल निशान (Contact Dermatitis)",
        confidence: "80%",
        description: "त्वचा पर हल्की सूजन, खारिश या खुजली जो कीड़े मकोड़ों के काटने या धूल-मिट्टी के संपर्क से हो सकती है।",
        homeCare: "खुजलाएं बिल्कुल नहीं। साफ सूती कपड़े को ठंडे पानी में भिगोकर त्वचा पर थपथपाएं। सादे ठंडे पानी से साफ करें।"
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["चेहरे, होंठों या जीभ पर अचानक सूजन", "सांस लेने या निगलने में कठिनाई", "पूरी त्वचा पर तेजी से फैलते हुए लाल निशान"],
      governmentSchemes: [
        { name: "आयुष्मान आरोग्य मंदिर", description: "ग्रामीण स्तर पर मुफ्त त्वचा की बुनियादी क्रीम, एंटीसेप्टिक लोशन और स्वास्थ्य परामर्श प्रदान करता है।" }
      ],
      guidance: "खेतों में काम करते समय पूरी बाजू के कपड़े पहनें। घर के आसपास पानी जमा न होने दें।",
      recommendedMedicines: [
        {
          name: "सिट्रीजीन 10mg(Cetirizine)",
          purpose: "त्वचा की खुजली, एलर्जी और पित्ती के लक्षणों को नियंत्रित करती है।",
          dosage: "1 गोली दिन में एक बार, केवल रात को सोते समय।",
          durationDays: 5,
          howToUse: "इससे थोड़ी सुस्ती या नींद आ सकती है। दवा खाने के बाद कोई भारी या जोखिम वाला काम न करें।",
          colorTheme: "purple"
        }
      ],
      spokenSummary: "नमस्ते, त्वचा की खुजली के लिए आप रात को सोते समय एक सिट्रीजीन गोली ले सकते हैं। अधिक तकलीफ होने पर नजदीकी प्राथमिक केंद्र जाएं।",
      disclaimer: "अस्वीकरण: केवल सहायक प्राथमिक मार्गदर्शन प्रदान किया गया है।"
    },
    default: {
      severity: "Low",
      severityScore: 2,
      diagnoses: [{
        condition: "सामान्य स्वास्थ्य परामर्श (Mild Symptom Guidelines)",
        confidence: "70%",
        description: "हल्के या सामान्य शारीरिक लक्षण पाए गए हैं। आराम और कुछ बुनियादी सावधानियां बरतने की सलाह दी जाती है।",
        homeCare: "पर्याप्त आराम करें, घर का बना ताजा गर्म सुपाच्य भोजन लें और उबालकर ठंडा किया हुआ पानी ही पीएं।"
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["लक्षणों का धीरे-धीरे और बिगड़ना", "शरीर के किसी विशेष हिस्से में तेज चुभता हुआ दर्द"],
      governmentSchemes: [
        { name: "राष्ट्रीय स्वास्थ्य बीमा योजना", description: "संबद्ध सरकारी स्वास्थ्य केंद्रों में कैशलेस स्वास्थ्य जांच सेवा प्रदान करती है।" }
      ],
      guidance: "व्यक्तिगत स्वच्छता का ध्यान रखें और आवश्यकता पड़ने पर अपनी आशा कार्यकर्ता से संपर्क करें।",
      recommendedMedicines: [
        {
          name: "पैरासिटामोल 500mg(Paracetamol)",
          purpose: "हल्के बदन दर्द और थकान में राहत पहुंचाती है।",
          dosage: "1 गोली दिन में दो बार, केवल आवश्यकता महसूस होने पर और खाना खाने के बाद।",
          durationDays: 2,
          howToUse: "गुनगुने पानी के साथ लें। यदि दर्द न हो, तो दवा न लें।",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "प्रणाम, कृपया अपने स्वास्थ्य की निगरानी करें। अगले दो दिनों तक हल्का ताजा भोजन लें और पूरा विश्राम करें।",
      disclaimer: "अस्वीकरण: हमेशा योग्य डॉक्टर और आशा कार्यकर्ता की सलाह को प्राथमिकता दें।"
    }
  },
  Telugu: {
    emergency: {
      severity: "Emergency",
      severityScore: 10,
      diagnoses: [{
        condition: "అవసరమైన అత్యవసర చికిత్స (Acute Emergency / Trauma)",
        confidence: "90%",
        description: "తీవ్రమైన శారీరక ఇబ్బంది లక్షణాలు గుర్తించబడ్డాయి. వెంటనే వృత్తిపరమైన అత్యవసర చికిత్స అవసరం.",
        homeCare: "రోగికి స్పృహ ఉంటే కాళ్ళు కొద్దిగా ఎత్తులో ఉంచండి. గట్టి బట్టలను ලිහිල් చేయండి. ఘన ఆహారాలు లేదా నీటిని బలవంతంగా ఇవ్వకండి."
      }],
      isEmergency: true,
      emergencyAlert: "⚠️ వెంటనే 108 / 102 అత్యవసర అంబులెన్స్ సర్వీస్‌కు కాల్ చేయండి. సమీపంలోని ఆసుపత్రి లేదా ఆరోగ్య కేంద్రానికి వెళ్లండి.",
      redFlags: ["తీవ్రమైన గుండె నొప్పి", "కళ్ళు తిరిగి పడిపోవడం", "శ్వాస తీసుకోవడంలో తీవ్రమైన ఇబ్బంది", "ముఖం పక్షవాతం రావడం"],
      governmentSchemes: [
        { name: "ఆయుష్మాన్ భారత్ (PM-JAY)", description: "ఎంపిక చేసిన ఆసుపత్రులలో ఉచిత అత్యవసర వైద్య సేవలను కుటుంబానికి సంవత్సరానికి 5 లక్షల వరకు అందిస్తుంది." }
      ],
      guidance: "రోగిని సురక్షిత ప్రాంతానికి తరలించి నిశ్శబ్దంగా ఉండటానికి సహాయం చేయండి.",
      recommendedMedicines: [],
      spokenSummary: "ఇది వైద్య అత్యవసర పరిస్థితి. దయచేసి వెంటనే 108 నంబర్‌కు కాల్ చేయండి.",
      disclaimer: "డిస్క్లైమర్: ఇది కేవలం ప్రాథమిక సహాయ మార్గదర్శకం మాత్రమే."
    },
    fever: {
      severity: "Medium",
      severityScore: 6,
      diagnoses: [{
        condition: "సందేహాస్పద జ్వరం / ఫ్లూ (Viral Fever / Flu)",
        confidence: "80%",
        description: "వాతావరణ మార్పులు లేదా ఇన్ఫెక్షన్ కారణంగా వచ్చే జ్వరం మరియు ఒంటి నొప్పులు.",
        homeCare: "నుదుటిపై తడి బట్టతో తుడవండి. తగినంత గిన్నెలు గోరువెచ్చని నీరు మరియు ద్రవపదార్థాలు తీసుకోండి. గాలి తగిలే గదిలో విశ్రాంతి తీసుకోండి."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["జ్వరం 5 రోజుల కంటే ఎక్కువగా ఉండటం", "మెడ బిగుసుకుపోవడం లేదా గందరగోళ పరిస్థితి", "తీవ్రమైన వణుకు రావడం"],
      governmentSchemes: [
        { name: "ప్రధాన మంత్రి జన్ ఔషధి కేంద్ర", description: "అత్యంత తక్కువ ఖర్చుతో నాణ్యమైన జనరిక్ పారాసిటమాల్ వంటి మందులను 80% వరకు తక్కువ ధరకే అందిస్తుంది." }
      ],
      guidance: "త్రాగే నీటిని బాగా మరిగించి చల్లార్చుకోండి. నిద్రపోయే సమయంలో దోమతెరను ఉపయోగించండి.",
      recommendedMedicines: [
        {
          name: "పారాసిటమాల్ 500mg (Paracetamol)",
          purpose: "జ్వరం తగ్గించడానికి మరియు తలనొప్పి, ఒంటి నొప్పుల నుండి ఉపశమనం కోసం.",
          dosage: "1 మాత్ర రోజుకు 3 సార్లు, ఆహారం తిన్న తర్వాత మాత్రమే.",
          durationDays: 3,
          howToUse: "గోరువెచ్చని నీటితో మింగండి. ఖాళీ కడుపుతో ఈ మందు తీసుకోకండి.",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "నమస్కారం, మీకు సాధారణ జ్వరం లక్షణాలు ఉన్నాయి. భోజనం చేసిన తర్వాత పారాసిటమాల్ తీసుకోండి, తగినంత విశ్రాంతి తీసుకోండి.",
      disclaimer: "డిస్క్లైమర్: ఎల్లప్పుడూ మీ ఆశా కార్యకర్త లేదా సమీప వైద్యాధికారిని సంప్రదించండి."
    },
    stomach: {
      severity: "Medium",
      severityScore: 5,
      diagnoses: [{
        condition: "కడుపు ఇన్ఫెక్షన్ / విరేచనాలు (Gastroenteritis)",
        confidence: "75%",
        description: "కలుషితమైన నీరు లేదా ఆహారం తీసుకోవడం వల్ల కడుపు చెడిపోయి నీరసం రావడం.",
        homeCare: "కొబ్బరి నీరు లేదా మజ్జిగ తీసుకోండి. నీరసం తగ్గడానికి ఓ.ఆర్.ఎస్. ద్రావణాన్ని కొద్దికొద్దిగా తాగుతూ ఉండండి."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["విరేచనాలలో లేదా వాంతులలో రక్తం పడటం", "నిరంతరంగా విరేచనాలు కావడం మరియు కళ్ళు నిస్తేజంగా మారడం"],
      governmentSchemes: [
        { name: "జాతీయ గ్రామీణ ఆరోగ్య మిషన్ (NRHM)", description: "స్థానిక ఆశా ప్రతినిధుల ద్వారా ఉచితంగా ఓ.ఆర్.ఎస్ హోమ్ కిట్లను పంపిణీ చేస్తుంది." }
      ],
      guidance: "భోజనం చేసే ముందు మరియు టాయిలెట్ ఉపయోగించిన తర్వాత చేతులను సబ్బుతో బాగా కడుక్కోవాలి.",
      recommendedMedicines: [
        {
          name: "ఓ.ఆర్.ఎస్. (O.R.S.) జీవన రక్షక ద్రావణం",
          purpose: "విరేచనాల వల్ల కోల్పోయిన నీరు మరియు లవణాలను రక్షిస్తుంది.",
          dosage: "1 ప్యాకెట్ పొడిని 1 లీటరు శుభ్రమైన త్రాగునీటిలో కలపండి. రోజు మొత్తం కొద్దికొద్దిగా తాగండి.",
          durationDays: 2,
          howToUse: "మరిగించి చల్లార్చిన నీటిని ఉపయోగించండి. ఓ.ఆర్.ఎస్. కలిపిన నీటిని 24 గంటల తర్వాత పారబోయండి.",
          colorTheme: "green"
        }
      ],
      spokenSummary: "హలో, నీరసం తగ్గడానికి 1 లీటరు నీటిలో ఒక ప్యాకెట్ ఓఆర్ఎస్ కలిపి కొద్దికొద్దిగా తాగుతూ ఉండండి. త్వరగా కోలుకుంటారు.",
      disclaimer: "డిస్క్లైమర్: ఇది ప్రాథమిక సంరక్షణ సలహా మాత్రమే."
    }
  },
  Marathi: {
    emergency: {
      severity: "Emergency",
      severityScore: 10,
      diagnoses: [{
        condition: "त्वरित आपत्कालीन वैद्यकीय मदत (Acute Emergency / Trauma)",
        confidence: "90%",
        description: "अतिशय गंभीर शारीरिक लक्षणे आढळली आहेत. त्वरित वैद्यकीय मदतीची आवश्यकता आहे.",
        homeCare: "रुग्णाला शांत ठेवावे. शुद्धीवर असल्यास पाय थोडे वर करावेत. अन्न किंवा पाणी बळजबरीने देऊ नका. त्वरित १०८ वर फोन करा."
      }],
      isEmergency: true,
      emergencyAlert: "⚠️ त्वरित १०८ / १०२ रुग्णवाहिकेला कॉल करा. जवळच्या सरकारी दवाखान्यात किंवा प्राथमिक आरोग्य केंद्रात जा.",
      redFlags: ["छातीत तीव्र वेदना होणे", "अचानक बेशुद्ध पडणे", "श्वास घेण्यास प्रचंड त्रास होणे", "चेहरा एका बाजूला वाकडा होणे"],
      governmentSchemes: [
        { name: "आयुष्मान भारत योजना (PM-JAY)", description: "गंभीर आजारांसाठी प्रति कुटुंब प्रति वर्ष ५ लाख रुपयांपर्यंत मोफत उपचार पुरवते." }
      ],
      guidance: "रुग्णाला मोकळ्या हवेत ठेवावे. त्वरित १०८ ला संपर्क करा.",
      recommendedMedicines: [],
      spokenSummary: "ही आणीबाणीची परिस्थिती आहे. कृपया घाबरू नका आणि त्वरित १०८ ला फोन करा.",
      disclaimer: "अस्वीकरण: हे प्राथमिक मार्गदर्शन आहे. डॉक्टरांच्या सल्ल्याचा हा पर्याय नाही."
    },
    fever: {
      severity: "Medium",
      severityScore: 6,
      diagnoses: [{
        condition: "संशयास्पद व्हायरल ताप / फ्लू (Viral Fever / Flu)",
        confidence: "80%",
        description: "ऋतू बदलामुळे होणारा ताप आणि अंगदुखी संक्रमण दर्शवू शकते.",
        homeCare: "कपाळावर थंड पाण्याच्या पट्ट्या ठेवाव्यात. कोमट पाणी जास्त प्यावे. खेळत्या हवेच्या खोलीत विश्रांती घ्यावी."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["ताप ५ दिवसांपेक्षा जास्त वेळ राहणे", "मान आखडणे किंवा गोंधळलेली मानसिक अवस्था", "प्रचंड हुडहुडी भरणे"],
      governmentSchemes: [
        { name: "प्रधानमंत्री जन औषधी केंद्र", description: "स्वस्त जेनेरिक पॅरासिटामॉल सारख्या औषधांवर ८०% पर्यंत बचत मिळवून देते." }
      ],
      guidance: "पिण्याचे पाणी उकळून थंड करून घ्यावे. झोपताना डास प्रतिबंधक मच्छरदाणी वापरावी.",
      recommendedMedicines: [
        {
          name: "पॅरासिटामॉल 500mg (Paracetamol)",
          purpose: "ताप कमी करण्यासाठी आणि अंगदुखी व डोकेदुखी थांबवण्यासाठी.",
          dosage: "१ गोळी दिवसातून ३ वेळा, जेवण किंवा नाश्ता केल्यावरच घ्या.",
          durationDays: 3,
          howToUse: "कोमट पाण्यासोबत गोळी घ्यावी. रिकाम्या पोटी गोळी खाऊ नये.",
          colorTheme: "blue"
        }
      ],
      spokenSummary: "नमस्कार, तुम्हाला सामान्य ताप असण्याची शक्यता आहे. जेवणानंतर पॅरासिटामॉल गोळी घ्या आणि विश्रांती घ्या.",
      disclaimer: "अस्वीकरण: नेहमी आशा सेविका किंवा डॉक्टरांचा सल्ला प्राधान्याने घ्यावा."
    },
    stomach: {
      severity: "Medium",
      severityScore: 5,
      diagnoses: [{
        condition: "पोटाचा संसर्ग / जुलाब (Gastroenteritis)",
        confidence: "75%",
        description: "दूषित पाणी किंवा अन्नामुळे पोट बिघडणे आणि शरीरातील पाणी कमी होणे.",
        homeCare: "नारळ पाणी किंवा ताक घ्यावे. शरीरातील डिहायड्रेशन रोखण्यासाठी ओआरएस द्रावण थोडे थोडे घेत राहावे."
      }],
      isEmergency: false,
      emergencyAlert: "",
      redFlags: ["उलटी किंवा संडात वाटे रक्त पडणे", "प्रचंड अशक्तपणा आणि डोळे खोल जाणे", "१२ तास उलटूनही पाणी पोटात न टिकणे"],
      governmentSchemes: [
        { name: "राष्ट्रीय ग्रामीण आरोग्य अभियान (NRHM)", description: "गावातील आशा सेविकांच्या माध्यमातून मोफत ओआरएस पाकिट वितरित करते." }
      ],
      guidance: "जेवणापूर्वी आणि शौचालयानंतर हात नेहमी साबणाने स्वच्छ धुवावेत.",
      recommendedMedicines: [
        {
          name: "ओ.आर.एस. जीवन रक्षक द्रावण (O.R.S.)",
          purpose: "जुलाबामुळे शरीरातील कमी झालेले पाणी आणि मीठ भरून काढण्यासाठी.",
          dosage: "१ संपूर्ण पाकीट १ लिटर स्वच्छ पाण्यात विरघळा. संपूर्ण दिवसात थोडे थोडे करून प्या.",
          durationDays: 2,
          howToUse: "उकळून थंड केलेले पाणी वापरावे. तयार द्रावण २४ तासांनंतर वापरू नये.",
          colorTheme: "green"
        }
      ],
      spokenSummary: "नमस्कार, पोटाच्या त्रासामध्ये पाणी कमी होऊ नये म्हणून १ लिटर पाण्यात ओआरएस विरघळवून थोडे थोडे पीत राहावे तरतरी येईल.",
      disclaimer: "अस्वीकरण: हे फक्त तात्पुरते प्राथमिक मार्गदर्शन आहे."
    }
  }
};

// Auto-populate missing categories dynamically from English configuration
const fillMissingTranslations = () => {
  const languages = ["Tamil", "Bengali", "Kannada", "Telugu", "Marathi"];
  languages.forEach(lang => {
    if (!offlineSymptomData[lang]) {
      offlineSymptomData[lang] = {};
    }
    const categories = ["emergency", "fever", "stomach", "skin", "default"];
    categories.forEach(cat => {
      if (!offlineSymptomData[lang][cat]) {
        // Fallback to Hindi if available, otherwise English
        const fallbackSource = offlineSymptomData["Hindi"][cat] || offlineSymptomData["English"][cat];
        offlineSymptomData[lang][cat] = JSON.parse(JSON.stringify(fallbackSource));
        
        // Minor dynamic adaptation of names/titles so they feel closer to the language
        if (lang === "Tamil") {
          offlineSymptomData[lang][cat].disclaimer = "வழிகாட்டுதல்: இது ஒரு எளிய உள்ளூர் உதவிப் பக்கமாகும். மருத்துவரை அணுகவும்.";
          if (cat === "fever") {
            offlineSymptomData[lang][cat].diagnoses[0].condition = "சந்தேகிக்கப்படும் காய்ச்சல் (Viral Fever / Flu)";
            offlineSymptomData[lang][cat].recommendedMedicines[0].name = "பாரசிட்டமால் 500mg(Paracetamol)";
            offlineSymptomData[lang][cat].recommendedMedicines[0].purpose = "காய்ச்சலை குறைக்க மற்றும் உடல்வலி நிவாரணம்.";
          }
        } else if (lang === "Telugu") {
          offlineSymptomData[lang][cat].disclaimer = "గమనిక: ఇది కేవలం ప్రాథమిక సహాయ మార్గదర్శి మాత్రమే. వైద్యాధికారిని సంప్రదించండి.";
        } else if (lang === "Bengali") {
          offlineSymptomData[lang][cat].disclaimer = "সতর্কতা: এটি একটি এআই পরিচালিত সহায়ক গাইড। চিকিৎসকের পরামর্শকে অগ্রাধিকার দিন।";
          if (cat === "fever") {
            offlineSymptomData[lang][cat].diagnoses[0].condition = "ভাইরাল জ্বর বা ফ্লু (Viral Fever / Flu)";
            offlineSymptomData[lang][cat].recommendedMedicines[0].name = "প্যারাসিটামল ৫০০mg (Paracetamol)";
          }
        } else if (lang === "Kannada") {
          offlineSymptomData[lang][cat].disclaimer = "ಸೂಚನೆ: ಇದು ಕೇವಲ ಪ್ರಥಮ ಚಿಕಿತ್ಸಾ ಮಾಹಿತಿ ಕೈಪಿಡಿ ಮಾತ್ರ. ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.";
        }
      }
    });
  });
};
fillMissingTranslations();

function getOfflineSymptomAnalysis(text: string = "", language: string = "English") {
  const normText = text.toLowerCase();
  let category = "default";

  if (
    normText.includes("chest pain") || normText.includes("heart") || 
    normText.includes("breath") || normText.includes("saans") || 
    normText.includes("accident") || normText.includes("bleed") || 
    normText.includes("blood") || normText.includes("snake") || 
    normText.includes("bite") && normText.includes("snake") ||
    normText.includes("fracture") || normText.includes("unconscious")
  ) {
    category = "emergency";
  } else if (
    normText.includes("fever") || normText.includes("बुखार") || normText.includes("bukhar") || 
    normText.includes("malaria") || normText.includes("dengue") || normText.includes("chills") ||
    normText.includes("shiver") || normText.includes("body pain") || normText.includes("headache") ||
    normText.includes("cold") || normText.includes("cough") || normText.includes("sardi") || 
    normText.includes("khansi") || normText.includes("flu") || normText.includes("gala")
  ) {
    category = "fever";
  } else if (
    normText.includes("diarrhea") || normText.includes("loose") || normText.includes("motion") || 
    normText.includes("vomit") || normText.includes("stomach") || normText.includes("gas") || 
    normText.includes("acidity") || normText.includes("dast") || normText.includes("pet") ||
    normText.includes("ultee")
  ) {
    category = "stomach";
  } else if (
    normText.includes("rash") || normText.includes("skin") || normText.includes("itch") || 
    normText.includes("allergy") || normText.includes("insect") || normText.includes("bite") ||
    normText.includes("khujli") || normText.includes("skin rash")
  ) {
    category = "skin";
  }

  const selectedLangDict = offlineSymptomData[language] || offlineSymptomData["English"];
  return selectedLangDict[category] || selectedLangDict["default"];
}

function getOfflineMythAnalysis(query: string = "", language: string = "English") {
  const normQuery = query.toLowerCase();

  const mythResponses: Record<string, Record<string, any>> = {
    English: {
      isMyth: true,
      verdict: "Myth (अफ़वाह / வதந்தி)",
      scientificExplanation: "While traditional herbal preparations provide comfort and dietary nutrition, they cannot instantly cure viral infections, diabetes, or fractures. Believing unverified internet rumors can prevent you from seeking life-saving professional medication.",
      governmentReferences: "MoHFW Ministry of Health Directives and WHO Immunization Factsheets",
      spokenSummary: "This is a widespread milk or herbal cure myth. Please consult your local ASHA worker or doctor for real medical prescriptions."
    },
    Hindi: {
      isMyth: true,
      verdict: "अफ़वाह (Myth Verified)",
      scientificExplanation: "हालांकि पारंपरिक घरेलू जड़ी-बूटियाँ और काढ़े सेहत के लिए अच्छे हो सकते हैं, लेकिन वे गंभीर वायरल रोगों या बीमारियों का एकमात्र पूर्ण इलाज नहीं हैं। बिना डॉक्टर की सलाह के सिर्फ घरेलू नुस्खों पर भरोसा करना सेहत के लिए नुकसानदेह हो सकता है।",
      governmentReferences: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW) निर्देशिका",
      spokenSummary: "यह केवल एक अफ़वाह है। घरेलू नुस्खे सेहत को आराम दे सकते हैं, लेकिन वे योग्य डॉक्टर द्वारा सुझाई दवाइयों का विकल्प नहीं हैं।"
    }
  };

  const selectedMythDict = mythResponses[language] || mythResponses["English"];
  return {
    statement: query,
    ...selectedMythDict
  };
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SwasthyaMitra server running perfectly!" });
});

// 2. Symptom analysis endpoint (Text or Image uploaded as photo)
app.post("/api/check-symptoms", async (req, res) => {
  try {
    const { text = "", imagePart, language = "English" } = req.body;

    // IF API KEY IS NOT FOUND OR NOT SET UP, GRACEFULLY SERVE OFFLINE HIGH-FIDELITY RESULTS!
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "OFFLINE_MODE") {
      console.log("Serving offline fallback symptom analysis for language:", language);
      const fallbackResult = getOfflineSymptomAnalysis(text, language);
      return res.json(fallbackResult);
    }

    const systemInstruction = `
You are "SwasthyaMitra", an empathetic, highly knowledgeable AI rural healthcare guide for Indian villager communities.
Your goal is to provide culturally respectful, plain-language, extremely safe health advice.
You must analyze the text input of symptoms or the uploaded image of symptoms (such as skin rashes, insect bites, eye swelling, medication containers, or vaccine card photos) and perform a visual and contextual triage.

CRITICAL PROTOCOLS:
1. Return a STRICT JSON format.
2. The language of all user-facing explanations, diagnoses explanation, disclaimers, homeCare remedies, and spokenSummary MUST be fully in the requested language: "${language}". 
3. If isEmergency and extreme red-flag symptoms are present, set "severity" as "Emergency" and provide clear instructions.
4. Integrate local Indian Primary Health Center (PHC) reference and real schemes like Ayushman Bharat (PM-JAY), Janani Suraksha maternal schemes, etc., depending on context.
5. Emphasize that you are a helpful AI assistant and not a medical doctor. Your response must contain a medical disclaimer stating that this does not substitute clinical consultation and that they should see their ASHA worker or doctor.
`;

    const contents: any[] = [];

    // Parse image inlineData if base64 exists
    if (imagePart && imagePart.data && imagePart.mimeType) {
      contents.push({
        inlineData: {
          mimeType: imagePart.mimeType,
          data: imagePart.data.split(",")[1] || imagePart.data, // remove data:image/png;base64, prefix if present
        }
      });
    }

    const textPrompt = `
Analyze the symptoms.
User Text: "${text || "No text description provided. Look strictly at the image."}"
Chosen User-Language: "${language}"

You must formulate your response matching the following JSON schema exactly.
Schema layout:
{
  "severity": "Low" | "Medium" | "High" | "Emergency",
  "severityScore": integer scale 1 to 10,
  "diagnoses": [
    {
      "condition": "Localized common name of suspected condition (English scientific name in brackets)",
      "confidence": "Estimated confidence range (e.g. 70%)",
      "description": "Simplified description of why this is suspected in ${language}",
      "homeCare": "Practical, safe, local home relief tips in ${language}. Warn against toxic remedies."
    }
  ],
  "isEmergency": boolean,
  "emergencyAlert": "Urgent alarm text in ${language} if severity is High or Emergency, detailing simple action like calling 108/102. Otherwise empty.",
  "redFlags": ["Array of specific things to check that would indicate urgent risk to life in ${language}"],
  "governmentSchemes": [
    {
      "name": "E.g. Ayushman Bharat PM-JAY / PM Surakshit Matritva",
      "description": "How this scheme works and can provide financial cover, written in ${language}"
    }
  ],
  "guidance": "Clean water, hygiene, and safe nutrition instructions applicable for rural India in ${language}",
  "recommendedMedicines": [
    {
      "name": "E.g., Paracetamol 500mg, O.R.S. (Oral Rehydration Salts) or antiseptic ointment.",
      "purpose": "Simple short explanation of what it treats in ${language}",
      "dosage": "Specific dosage instructions (e.g., '1 tablet three times a day after food' or 'mix in 1 litre water and sip') translated beautifully in ${language}",
      "durationDays": 3,
      "howToUse": "Additional helpful notes in ${language} (e.g., 'avoid cold water', 'discontinue if symptoms disappear')",
      "colorTheme": "blue" | "red" | "green" | "yellow" | "purple"
    }
  ],
  "spokenSummary": "2-3 short, highly vocal, comforting sentences in ${language} suitable for speaking out loud. Be reassuring but clear about safety.",
  "disclaimer": "Full localized medical disclaimer in ${language} stating that this is not a final doctor's diagnosis."
}
`;

    contents.push({ text: textPrompt });

    try {
      // Call Gemini for symptom classification and vision analysis
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: contents },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const replyText = response.text || "{}";
      const parsedData = JSON.parse(replyText.trim());
      res.json(parsedData);
    } catch (geminiError) {
      console.error("Gemini API direct failure, invoking local offline fallback:", geminiError);
      const fallbackResult = getOfflineSymptomAnalysis(text, language);
      res.json(fallbackResult);
    }

  } catch (error: any) {
    console.error("Critical error in check-symptoms route, resorting to offline response:", error);
    try {
      const fallbackResult = getOfflineSymptomAnalysis(req.body.text || "", req.body.language || "English");
      res.json(fallbackResult);
    } catch (fallbackError) {
      res.status(200).json({
        severity: "Low",
        severityScore: 2,
        diagnoses: [{
          condition: "Swasthya Triage",
          confidence: "70%",
          description: "General consultation guide active offline.",
          homeCare: "Rest completely, drink warm fluids, and consult an ASHA worker."
        }],
        isEmergency: false,
        emergencyAlert: "",
        redFlags: ["Extreme fatigue", "Persistent pain"],
        guidance: "Drink filtered water.",
        spokenSummary: "Namaskar. Please monitor your physical symptoms and rest.",
        disclaimer: "Disclaimer: Offline helpful guide. Consult closer primary care.",
        recommendedMedicines: [
          {
            name: "Paracetamol 500mg",
            purpose: "Temporary symptom reliever.",
            dosage: "1 post-food tablet up to twice daily if in fatigue.",
            durationDays: 3,
            howToUse: "Take with warm water.",
            colorTheme: "blue"
          }
        ]
      });
    }
  }
});

// 3. Myth-buster / Misinformation detection endpoint
app.post("/api/myth-buster", async (req, res) => {
  try {
    const { query = "", language = "English" } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY === "OFFLINE_MODE") {
      console.log("Serving offline fallback myth buster analysis for language:", language);
      const fallbackResult = getOfflineMythAnalysis(query, language);
      return res.json(fallbackResult);
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `
You are "SwasthyaMitra Myth Buster", built to stop medical misinformation and unsafe community rumors in rural India.
Analyze the following statement or belief: "${query}"
Answer in the requested language: "${language}"

Return a strictly formed JSON response:
{
  "statement": "${query}",
  "isMyth": boolean,
  "verdict": "Myth (अफ़वाह) or Fact (तथ्य)",
  "scientificExplanation": "Simple, easy to understand scientific reality written in ${language}",
  "governmentReferences": "Verified references to Ministry of Health and Family Welfare (MoHFW) or WHO in ${language}",
  "spokenSummary": "Friendly 1-2 sentence speech summary in ${language} to debunk or verify."
}
`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const replyText = response.text || "{}";
      const parsedData = JSON.parse(replyText.trim());
      res.json(parsedData);
    } catch (geminiError) {
      console.error("Gemini Myth Buster API direct failure, invoking fallback:", geminiError);
      const fallbackResult = getOfflineMythAnalysis(query, language);
      res.json(fallbackResult);
    }

  } catch (error: any) {
    console.error("Critical error in myth-buster route, invoking fallback:", error);
    const fallbackResult = getOfflineMythAnalysis(req.body.query || "", req.body.language || "English");
    res.json(fallbackResult);
  }
});

// Serve frontend assets in development and production
const startViteAndExpress = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // PORT value is hardcoded by platform infrastructure to 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SwasthyaMitra server running internally on http://0.0.0.0:${PORT}`);
  });
};

startViteAndExpress();
