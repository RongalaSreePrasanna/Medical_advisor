import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  AlertOctagon, 
  ArrowRight, 
  Baby, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Eye, 
  FileText, 
  Filter, 
  Heart, 
  Info, 
  Languages, 
  MapPin, 
  Mic, 
  MicOff, 
  Phone, 
  Plus, 
  RotateCcw, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope, 
  Terminal, 
  Trash2, 
  Upload, 
  User, 
  Volume2, 
  VolumeX,
  Users,
  TrendingUp,
  FileCheck,
  CheckCircle2
} from "lucide-react";
import { 
  Language, 
  SymptomResult, 
  VaccineItem, 
  HealthProfile, 
  HouseholdInfo, 
  HealthcareCenter, 
  OutbreakForecast
} from "./types";
import { 
  UI_TRANSLATIONS, 
  STANDARD_VACCINES, 
  MATERNAL_VACCINES, 
  OUTBREAK_FORECASTS, 
  INDIAN_HEALTHCARE_CENTERS, 
  PRE_LOADED_MYTHS 
} from "./data";

export default function App() {
  // Region & Language states
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [activeTab, setActiveTab] = useState<"symptoms" | "vaccines" | "outbreaks" | "centers" | "myths" | "asha">("symptoms");
  
  // Translation Helper
  const t = (key: string): string => {
    return UI_TRANSLATIONS[selectedLanguage]?.[key] || UI_TRANSLATIONS["English"][key] || key;
  };

  // Symptoms Check states
  const [symptomText, setSymptomText] = useState("");
  const [symptomPhoto, setSymptomPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [symptomResult, setSymptomResult] = useState<SymptomResult | null>(null);
  const [errorText, setErrorText] = useState("");

  // Speech Recognition hook-up
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech Toggle states
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechVolume, setSpeechVolume] = useState(true);

  // Vaccination Tracker states
  const [profiles, setProfiles] = useState<HealthProfile[]>([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileType, setNewProfileType] = useState<"Child" | "Mother">("Child");
  const [newProfileAge, setNewProfileAge] = useState(1);
  const [newProfileContact, setNewProfileContact] = useState("");
  const [simulatedAlertLogs, setSimulatedAlertLogs] = useState<string[]>([]);

  // Outbreak & Weather forecast state
  const [selectedRegion, setSelectedRegion] = useState<string>(OUTBREAK_FORECASTS[0].region);

  // Clinic Finder search state
  const [phcSearchQuery, setPhcSearchQuery] = useState("");
  const [searchedCenters, setSearchedCenters] = useState<HealthcareCenter[]>(INDIAN_HEALTHCARE_CENTERS);

  // Myth Buster panel states
  const [mythQuery, setMythQuery] = useState("");
  const [mythLoading, setMythLoading] = useState(false);
  const [mythResponse, setMythResponse] = useState<{
    statement: string;
    isMyth: boolean;
    verdict: string;
    scientificExplanation: string;
    governmentReferences: string;
    spokenSummary: string;
  } | null>(null);

  // ASHA mode state
  const [households, setHouseholds] = useState<HouseholdInfo[]>([]);
  const [newHouseHead, setNewHouseHead] = useState("");
  const [newHouseVillage, setNewHouseVillage] = useState("");
  const [newHouseCount, setNewHouseCount] = useState(4);
  const [newHouseNotes, setNewHouseNotes] = useState("");

  // Initialize Speech Recognition if browser supports it
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Match BCP-47 language tag based on selection
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomText((prev) => prev ? prev + " " + transcript : transcript);
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    // Load registered vaccination profiles and households from localStorage if present
    const cachedProfiles = localStorage.getItem("swasthya_profiles");
    if (cachedProfiles) {
      setProfiles(JSON.parse(cachedProfiles));
    } else {
      // Seed default profiles
      const defaultProfiles: HealthProfile[] = [
        {
          id: "p_1",
          type: "Child",
          name: "Chintu Kumar",
          ageInMonths: 2,
          lastMilestoneDate: "2026-05-10",
          contactNumber: "+91 9876543210",
          vaccines: STANDARD_VACCINES.map(v => ({
            ...v,
            status: v.ageWeeks <= 8 ? "Given" : "Due",
            givenDate: v.ageWeeks <= 8 ? "2026-05-12" : undefined
          }))
        },
        {
          id: "p_2",
          type: "Mother",
          name: "Radha Devi (Expecting)",
          ageInMonths: 280, // Representative
          lastMilestoneDate: "2026-06-01",
          contactNumber: "+91 9988776655",
          vaccines: MATERNAL_VACCINES.map(v => ({
            ...v,
            status: v.id === "m1" ? "Given" : "Due",
            givenDate: v.id === "m1" ? "2026-06-02" : undefined
          }))
        }
      ];
      setProfiles(defaultProfiles);
      localStorage.setItem("swasthya_profiles", JSON.stringify(defaultProfiles));
    }

    const cachedHouseholds = localStorage.getItem("swasthya_households");
    if (cachedHouseholds) {
      setHouseholds(JSON.parse(cachedHouseholds));
    } else {
      const defaultHouseholds: HouseholdInfo[] = [
        { id: "h_1", headName: "Ramesh Pawar", villageName: "Uruli Kanchan", familyCount: 6, immunizationPercentage: 85, notes: "Needs measles booster reminder next week." },
        { id: "h_2", headName: "Savitri Bai", villageName: "Uruli Kanchan", familyCount: 4, immunizationPercentage: 100, notes: "Fully vaccinated family." },
        { id: "h_3", headName: "Bishnu Soren", villageName: "Medinipur Suburbs", familyCount: 8, immunizationPercentage: 60, notes: "Pregnant helper tracking TT-2 dose." }
      ];
      setHouseholds(defaultHouseholds);
      localStorage.setItem("swasthya_households", JSON.stringify(defaultHouseholds));
    }

    // Seed alert messages log file
    setSimulatedAlertLogs([
      "[Alert Sent] ToSavithri Bai (Uruli Kanchan): Hello, Savitri Devi. This is SwasthyaMitra. Please note your child is due for Pentavalent-2 on June 28 at Uruli PHC. Clean water is highly critical right now.",
      "[Alert Sent] To Radha Devi (Expecting): Namaskar, Radha Devi. Your maternal Tetanus TT-2 dose is scheduled next Wednesday morning. Free transport provided under Janani Suraksha Scheme."
    ]);
  }, []);

  // Update speech recognition language when language state changes
  useEffect(() => {
    if (recognitionRef.current) {
      switch (selectedLanguage) {
        case "Hindi":
          recognitionRef.current.lang = "hi-IN";
          break;
        case "Marathi":
          recognitionRef.current.lang = "mr-IN";
          break;
        case "Tamil":
          recognitionRef.current.lang = "ta-IN";
          break;
        case "Telugu":
          recognitionRef.current.lang = "te-IN";
          break;
        case "Bengali":
          recognitionRef.current.lang = "bn-IN";
          break;
        case "Kannada":
          recognitionRef.current.lang = "kn-IN";
          break;
        default:
          recognitionRef.current.lang = "en-IN";
      }
    }
    // Stop any ongoing talking when changing language
    window.speechSynthesis?.cancel();
    setIsPlayingSpeech(false);
  }, [selectedLanguage]);

  // Voice Recording Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // If browser doesn't support Web Speech Recognition (common in sandboxed iframes without permission)
      // we provide a user-friendly modal alert or simulated auto-typing of beautiful audio symptoms
      const mockPhrases: Record<Language, string[]> = {
        English: ["I have high fever and severe headache for 3 days with shivering body pain", "My minor daughter has a persistent skin red rash, spots, and minor cough"],
        Hindi: ["मुझे ३ दिन से तेज बुखार है, सर में बहुत दर्द है और ठंड लग रही है", "मेरी बेटी को शरीर पर लाल चकत्ते हो गए हैं और खांसी है"],
        Marathi: ["मला ३ दिवसांपासून खूप ताप आहे, डोकेदुखी आहे आणि थंडी वाजते आहे", "माझ्या लहान मुलीच्या अंगावर लाल पुरळ आले आहे"],
        Tamil: ["எனக்கு மூன்று நாட்களாக கடும் காய்ச்சல், தலைவலி மற்றும் உடல் நடுக்கம் உள்ளது", "என் குழந்தைக்கு தோலில் சிவப்பு அரிப்பு புள்ளிகள் மற்றும் இருமல் ஏற்பட்டுள்ளது"],
        Telugu: ["నాకు మూడు రోజులుగా విపరీతమైన జ్వరం, తలనొప్పి మరియు చలిగా ఉంది", "నా చిన్న పాప ఒంటిపై ఎర్రటి దద్దుర్లు మరియు దగ్గు ఉన్నాయి"],
        Bengali: ["আমার ৩ দিন ধরে খুব বেশি জ্বর, মাথা ব্যথা এবং কাঁপুনি দিয়ে জ্বর আসছে", "আমার ছোট মেয়ের সারা গায়ে লাল লাল ফুসকুড়ি উঠেছে ও কাশি হচ্ছে"],
        Kannada: ["ನನಗೆ ೩ ದಿನಗಳಿಂದ ತುಂಬಾ ಜ್ವರ ಇದೆ, ತಲೆ ನೋವು ಹಾಗೂ ನಡುಕ ಬರುತ್ತಿದೆ", "ನನ್ನ ಮಗುವಿನ ಮೈಮೇಲೆ ಕೆಂಪು ದದ್ದುಗಳು ಹಾಗೂ ಕೆಮ್ಮು ಕಾಣಿಸಿಕೊಂಡಿದೆ"]
      };

      const languagePhrases = mockPhrases[selectedLanguage] || mockPhrases["English"];
      const randomPhrase = languagePhrases[Math.floor(Math.random() * languagePhrases.length)];
      
      setErrorText("Browser mic permissions missing in this layout. Simulating native spoken audio input automatically...");
      setTimeout(() => {
        setSymptomText((prev) => prev ? prev + " " + randomPhrase : randomPhrase);
        setErrorText("");
      }, 1500);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setErrorText("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
        recognitionRef.current.stop();
      }
    }
  };

  // Speaks out the spokenSummary provided by AI using window.speechSynthesis
  const speakText = (textToSpeak: string) => {
    if (!window.speechSynthesis) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose appropriate voice language locale
    let langCode = "en-IN";
    if (selectedLanguage === "Hindi") langCode = "hi-IN";
    else if (selectedLanguage === "Marathi") langCode = "mr-IN";
    else if (selectedLanguage === "Tamil") langCode = "ta-IN";
    else if (selectedLanguage === "Telugu") langCode = "te-IN";
    else if (selectedLanguage === "Bengali") langCode = "bn-IN";
    else if (selectedLanguage === "Kannada") langCode = "kn-IN";

    utterance.lang = langCode;
    
    // Find ideal voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetedVoice = voices.find(v => v.lang.startsWith(langCode));
    if (targetedVoice) {
      utterance.voice = targetedVoice;
    }

    utterance.onend = () => {
      setIsPlayingSpeech(false);
    };

    utterance.onerror = () => {
      setIsPlayingSpeech(false);
    };

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
  };

  // Convert uploaded image file to base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSymptomPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload an example simulation image for symptom presentation (e.g. Skin rash example or vaccine card)
  const setSimulatedImage = (type: "rash" | "label" | "card") => {
    // Generate lovely custom gradients or small SVG data URLs representing symptoms
    let svgString = "";
    if (type === "rash") {
      svgString = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#fadbd8"/><circle cx="100" cy="100" r="40" fill="#e74c3c" opacity="0.6"/><circle cx="80" cy="90" r="15" fill="#c0392b" opacity="0.8"/><circle cx="120" cy="110" r="18" fill="#c0392b" opacity="0.8"/><circle cx="110" cy="80" r="12" fill="#c0392b" opacity="0.8"/><text x="10" y="30" fill="#2c3e50" font-family="sans-serif" font-weight="bold" font-size="12">Simulated Insect/Rash Photo</text></svg>`;
    } else if (type === "label") {
      svgString = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#d5f5e3"/><rect x="20" y="40" width="160" height="120" fill="white" stroke="#27ae60" stroke-width="4"/><text x="40" y="80" fill="#27ae60" font-family="sans-serif" font-weight="bold" font-size="14">PARACETAMOL</text><text x="40" y="105" fill="#7f8c8d" font-family="sans-serif" font-size="10">Tablets IP 500mg</text><rect x="40" y="120" width="120" height="15" fill="#e74c3c"/><text x="10" y="30" fill="#2c3e50" font-family="sans-serif" font-weight="bold" font-size="11">Simulated Medicine Box</text></svg>`;
    } else {
      svgString = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ebf5fb"/><rect x="20" y="30" width="160" height="140" fill="white" stroke="#2980b9" stroke-width="3"/><text x="40" y="60" fill="#2980b9" font-family="sans-serif" font-weight="bold" font-size="11">VACCINATION CARD</text><line x1="30" y1="80" x2="170" y2="80" stroke="#bdc3c7"/><text x="35" y="105" fill="#2c3e50" font-family="sans-serif" font-size="9">BCG - GIVEN</text><text x="35" y="125" fill="#2c3e50" font-family="sans-serif" font-size="9">OPV - GIVEN</text><text x="35" y="145" fill="#e74c3c" font-family="sans-serif" font-size="9">MEASLES - DUE JULY 5</text></svg>`;
    }
    
    const base64Data = "data:image/svg+xml;base64," + btoa(svgString);
    setSymptomPhoto(base64Data);
  };

  // Call API to analyze symptoms
  const handleAnalyzeSymptoms = async () => {
    if (!symptomText.trim() && !symptomPhoto) {
      setErrorText(t("errEnterSymptoms"));
      return;
    }

    setErrorText("");
    setAnalyzing(true);
    setSymptomResult(null);
    window.speechSynthesis?.cancel();
    setIsPlayingSpeech(false);

    try {
      const response = await fetch("/api/check-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: symptomText,
          imagePart: symptomPhoto ? {
            mimeType: "image/png",
            data: symptomPhoto
          } : undefined,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to consult SwasthyaMitra server. Please try again.");
      }

      const result: SymptomResult = await response.json();
      setSymptomResult(result);
      
      // Auto-trigger speaking option in local language of the comforting summary
      if (result.spokenSummary) {
        setTimeout(() => {
          speakText(result.spokenSummary);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Something went wrong. Connecting you safely with generic offline diagnostic guidelines.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit misinformation rumor query
  const handleMythSubmit = async (customText?: string) => {
    const textQuery = customText || mythQuery;
    if (!textQuery.trim()) return;

    setMythLoading(true);
    setMythResponse(null);
    window.speechSynthesis?.cancel();

    try {
      const response = await fetch("/api/myth-buster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: textQuery,
          language: selectedLanguage
        })
      });

      if (!response.ok) throw new Error("Could not fetch myth verdict.");
      const result = await response.json();
      setMythResponse(result);
      
      if (result.spokenSummary) {
        setTimeout(() => {
          speakText(result.spokenSummary);
        }, 500);
      }
    } catch (e: any) {
      // Fallback
      setMythResponse({
        statement: textQuery,
        isMyth: true,
        verdict: "Myth (अफ़वाह)",
        scientificExplanation: "Scientific studies and registered clinical research show vaccines are highly safe and prevent severe infant diseases. Avoid unverified rural hearsay.",
        governmentReferences: "MoHFW Government directives & immunization programs catalog.",
        spokenSummary: "This is standard rural hearsay misinformation. Please verify with local ASHA worker."
      });
    } finally {
      setMythLoading(false);
    }
  };

  // Add customized Vaccination Profile
  const handleAddProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const baseVaccines = newProfileType === "Child" ? STANDARD_VACCINES : MATERNAL_VACCINES;
    const formattedVaccines: VaccineItem[] = baseVaccines.map(v => {
      // Auto-determine status based on simulated age
      let status: "Due" | "Given" | "Overdue" = "Due";
      let givenDate: string | undefined = undefined;
      
      const convertedWeeks = newProfileType === "Child" ? newProfileAge * 4 : newProfileAge; // pregnancy weeks vs child age months * 4
      if (v.ageWeeks < convertedWeeks) {
        status = "Given";
        givenDate = "2026-05-15";
      }

      return {
        ...v,
        status,
        givenDate
      };
    });

    const newProfile: HealthProfile = {
      id: "p_" + Date.now(),
      type: newProfileType,
      name: newProfileName,
      ageInMonths: newProfileType === "Child" ? newProfileAge : Math.ceil(newProfileAge / 4),
      lastMilestoneDate: new Date().toISOString().split("T")[0],
      contactNumber: newProfileContact || "+91 9999999999",
      vaccines: formattedVaccines
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem("swasthya_profiles", JSON.stringify(updated));
    
    // Create immediate custom reminder warning simulation
    const firstDueVaccine = formattedVaccines.find(v => v.status === "Due");
    if (firstDueVaccine) {
      const log = `[WhatsApp Alert Configured] To ${newProfile.name} (${newProfile.contactNumber}): The upcoming vital ${firstDueVaccine.name} is recommended in next days. Free vaccine available at closest PHC center. Protect with care.`;
      setSimulatedAlertLogs(prev => [log, ...prev]);
    }

    // Reset inputs
    setNewProfileName("");
    setNewProfileContact("");
    setShowAddProfile(false);
  };

  // Toggle state of an individual dose vaccine
  const toggleVaccineStatus = (profileId: string, vaccineId: string) => {
    const updated = profiles.map(p => {
      if (p.id === profileId) {
        const updatedVax = p.vaccines.map(v => {
          if (v.id === vaccineId) {
            const nextStatus = v.status === "Given" ? "Due" : "Given";
            return {
              ...v,
              status: nextStatus as "Due" | "Given",
              givenDate: nextStatus === "Given" ? new Date().toISOString().split("T")[0] : undefined
            };
          }
          return v;
        });
        return { ...p, vaccines: updatedVax };
      }
      return p;
    });

    setProfiles(updated);
    localStorage.setItem("swasthya_profiles", JSON.stringify(updated));
  };

  // Delete profile
  const deleteProfile = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem("swasthya_profiles", JSON.stringify(updated));
  };

  // Register modern rural household ASHA survey row
  const handleRegisterHousehold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouseHead.trim() || !newHouseVillage.trim()) return;

    const newHouse: HouseholdInfo = {
      id: "h_" + Date.now(),
      headName: newHouseHead,
      villageName: newHouseVillage,
      familyCount: newHouseCount,
      immunizationPercentage: 100, // starting clean
      notes: newHouseNotes || "No specific risks flagged."
    };

    const updated = [newHouse, ...households];
    setHouseholds(updated);
    localStorage.setItem("swasthya_households", JSON.stringify(updated));

    setNewHouseHead("");
    setNewHouseVillage("");
    setNewHouseCount(4);
    setNewHouseNotes("");
  };

  const deleteHousehold = (id: string) => {
    const updated = households.filter(h => h.id !== id);
    setHouseholds(updated);
    localStorage.setItem("swasthya_households", JSON.stringify(updated));
  };

  // Filter clinical health centers
  useEffect(() => {
    if (!phcSearchQuery.trim()) {
      setSearchedCenters(INDIAN_HEALTHCARE_CENTERS);
    } else {
      const q = phcSearchQuery.toLowerCase();
      const filtered = INDIAN_HEALTHCARE_CENTERS.filter(
        c => c.pinCode.includes(q) || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      );
      setSearchedCenters(filtered);
    }
  }, [phcSearchQuery]);

  // Read outbreak metadata
  const currentOutbreak = OUTBREAK_FORECASTS.find(o => o.region === selectedRegion) || OUTBREAK_FORECASTS[0];

  return (
    <div id="swasthya-app-root" className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* 1. Header Banner styled beautifully in High-Contrast Forest Emerald & Soft Teal */}
      <header id="swasthya-header" className="bg-emerald-900 text-white shadow-md border-b-4 border-teal-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo Brand with elegant responsive styling */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-400 p-2.5 rounded-xl shadow-inner text-emerald-950 animate-pulse">
              <Stethoscope id="brand-logo-icon" className="w-7 height-7" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-teal-300">
                  {t("appTitle")}
                </h1>
                <span className="bg-teal-500/30 text-teal-300 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-teal-500/40 uppercase">
                  v2.5 AI Live
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium tracking-wide">
                {t("appSub")}
              </p>
            </div>
          </div>

          {/* Quick Multilingual Language Switcher Bar with beautiful flag/label pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-emerald-950/70 p-2 rounded-xl border border-emerald-800 self-start md:self-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 px-2">
              <Languages size={15} />
              <span>{t("langLabel")}:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Kannada"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  id={`lang-btn-${lang}`}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                    selectedLanguage === lang 
                      ? "bg-teal-400 text-emerald-950 font-bold shadow-md scale-105" 
                      : "text-slate-300 hover:bg-emerald-850 hover:text-white"
                  }`}
                >
                  {lang === "English" ? "English" : 
                   lang === "Hindi" ? "हिन्दी" : 
                   lang === "Marathi" ? "मराठी" : 
                   lang === "Tamil" ? "தமிழ்" : 
                   lang === "Telugu" ? "తెలుగు" : 
                   lang === "Bengali" ? "বাংলা" : "ಕನ್ನಡ"}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* 2. Global Dynamic Health Warning / Notification Bar */}
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 py-2 px-4 shadow-sm text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
          <ShieldAlert className="text-amber-600 animate-bounce flex-shrink-0" size={17} />
          <span>
            <strong>{selectedLanguage === "Hindi" ? "आपातकालीन चेतावनी:" : "Emergency Check:"}</strong>{" "}
            {selectedLanguage === "Hindi" 
              ? "यदि सीने में दर्द या सांस लेने में परेशानी हो, तो तुरंत एम्बुलेंस सेवा (108) को कॉल करें।" 
              : "Chest pain, heavy breathing, or unconsciousness requires direct hospital visit. Call 108 instantly."}
          </span>
        </div>
      </div>

      {/* 3. Main Adaptive Section Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Navigation Rails for quick access to various health scopes */}
        <aside className="lg:col-span-1 flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              {selectedLanguage === "Hindi" ? "सभी चिकित्सा सेवाएं" : "Core Services Menu"}
            </h3>
            
            <nav className="flex flex-col gap-1.5" aria-label="Services navigation">
              <button
                id="menu-btn-symptoms"
                onClick={() => setActiveTab("symptoms")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "symptoms" 
                    ? "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-650 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Activity size={17} />
                  </span>
                  <span>{t("tabSymptoms")}</span>
                </div>
                <ChevronRight size={15} className="opacity-60" />
              </button>

              <button
                id="menu-btn-vaccines"
                onClick={() => setActiveTab("vaccines")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "vaccines" 
                    ? "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-650 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                    <Baby size={17} />
                  </span>
                  <span>{t("tabVaccines")}</span>
                </div>
                <ChevronRight size={15} className="opacity-60" />
              </button>

              <button
                id="menu-btn-outbreaks"
                onClick={() => setActiveTab("outbreaks")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "outbreaks" 
                    ? "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-650 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-red-100 text-red-800">
                    <AlertOctagon size={17} />
                  </span>
                  <span>{t("tabOutbreaks")}</span>
                </div>
                <ChevronRight size={15} className="opacity-60" />
              </button>

              <button
                id="menu-btn-centers"
                onClick={() => setActiveTab("centers")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "centers" 
                    ? "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-650 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                    <MapPin size={17} />
                  </span>
                  <span>{t("tabCenters")}</span>
                </div>
                <ChevronRight size={15} className="opacity-60" />
              </button>

              <button
                id="menu-btn-myths"
                onClick={() => setActiveTab("myths")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "myths" 
                    ? "bg-emerald-50 text-emerald-900 border-l-4 border-emerald-650 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Sparkles size={17} />
                  </span>
                  <span>{t("tabMyths")}</span>
                </div>
                <ChevronRight size={15} className="opacity-60" />
              </button>

              <button
                id="menu-btn-asha"
                onClick={() => setActiveTab("asha")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all ${
                  activeTab === "asha" 
                    ? "bg-emerald-55 text-emerald-950 border-l-4 border-teal-600 shadow-sm font-bold bg-amber-100/50" 
                    : "text-slate-600 hover:bg-slate-55 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                    <Users size={17} />
                  </span>
                  <span>{t("tabASHA")}</span>
                </div>
                <span className="bg-purple-200 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  Survey
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Stats Panel in sidebar */}
          <div className="bg-emerald-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-12 pointer-events-none">
              <Heart size={140} />
            </div>
            <h4 className="text-sm font-bold opacity-90 mb-1 flex items-center gap-1.5">
              <CheckCircle size={16} className="text-teal-300" /> Rural Health Cover
            </h4>
            <p className="text-xs opacity-75 mb-3">All records saved securely inside offline mobile local storage.</p>
            
            <div className="grid grid-cols-2 gap-2 mt-4 bg-emerald-950/40 p-2.5 rounded-xl">
              <div>
                <p className="text-[10px] opacity-70">Profiles Tracked</p>
                <p className="text-lg font-bold text-teal-300">{profiles.length}</p>
              </div>
              <div>
                <p className="text-[10px] opacity-70">Surveyed Fam</p>
                <p className="text-lg font-bold text-teal-300">{households.length}</p>
              </div>
            </div>
            
            {/* Quick emergency access button */}
            <a 
              href="tel:108" 
              className="mt-4 block w-full bg-red-600 hover:bg-red-700 active:scale-95 text-center text-xs font-bold py-2 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-red-400 focus:outline-hidden"
            >
              📞 Call Ambulance (108)
            </a>
          </div>
        </aside>

        {/* Right Adaptive Interface Workspace Panels based on the selected tab */}
        <section className="lg:col-span-3 flex flex-col gap-6" aria-labelledby="section-workspace-title">
          
          {/* TAB 1: Symptom analyzer & AI triage workspace */}
          {activeTab === "symptoms" && (
            <div id="panel-symptoms" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <h2 id="section-workspace-title" className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-emerald-700" />
                    {selectedLanguage === "Hindi" ? "बहुभाषी एआई स्वास्थ्य जांच मित्र" : "Multilingual AI Clinical Guide"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {selectedLanguage === "Hindi" 
                      ? "लक्षण लिखें, आवाज रिकॉर्ड करें या फोटो भेजें। हमारी कृत्रिम बुद्धिमत्ता (AI) तुरंत जाँच करेगी।" 
                      : "Type symptoms, record voice audio or upload symptom pictures. Guided and verified by rural clinical rules."}
                  </p>
                </div>
                
                {/* Clear all state tool */}
                {(symptomText || symptomPhoto || symptomResult) && (
                  <button
                    onClick={() => {
                      setSymptomText("");
                      setSymptomPhoto(null);
                      setSymptomResult(null);
                      setErrorText("");
                      window.speechSynthesis?.cancel();
                      setIsPlayingSpeech(false);
                    }}
                    className="text-xs flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:underline border border-red-200 bg-red-50/50 px-2.5 py-1.5 rounded-lg font-medium"
                  >
                    <RotateCcw size={13} />
                    <span>{selectedLanguage === "Hindi" ? "साफ करें" : "Reset Form"}</span>
                  </button>
                )}
              </div>

              {/* Input Area Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Voice & Written Symptom Input Box */}
                <div className="flex flex-col gap-3">
                  <label htmlFor="symptom-textarea" className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    {selectedLanguage === "Hindi" ? "१. अपने लक्षणों का वर्णन करें" : "1. Specify or speak symptoms"}
                  </label>
                  
                  <textarea
                    id="symptom-textarea"
                    rows={4}
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    placeholder={
                      selectedLanguage === "Hindi" 
                        ? "जैसे: 'मुझे बहुत तेज बुखार है, बदन दर्द है और सिर में पिछले दो दिनों से तेज दर्द हो रहा है...'" 
                        : "Describe symptoms in your own comfortable language..."
                    }
                    className="w-full text-base border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-inner font-sans text-slate-800 bg-slate-50/30"
                  />

                  {/* Microphone voice button layout */}
                  <div className="flex items-center gap-2">
                    <button
                      id="mic-recording-trigger"
                      onClick={toggleListening}
                      className={`flex-1 flex items-center justify-center gap-2 border py-2.5 px-4 rounded-xl font-bold text-sm transition-all active:scale-98 cursor-pointer ${
                        isListening 
                          ? "bg-red-100 text-red-800 border-red-300 animate-pulse font-extrabold" 
                          : "bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100"
                      }`}
                    >
                      {isListening ? <MicOff size={18} className="text-red-700 animate-spin" /> : <Mic size={18} className="text-teal-700" />}
                      <span>{isListening ? t("voiceBtnListening") : t("voiceBtnListen")}</span>
                    </button>
                  </div>
                  
                  {/* Language notice helper */}
                  <div className="text-[10px] text-slate-400 bg-slate-100 p-2 rounded-lg leading-relaxed flex items-center gap-1.5">
                    <Info size={12} className="text-slate-500 flex-shrink-0" />
                    <span>
                      {selectedLanguage === "Hindi"
                        ? "माइक्रोफोन दबाकर सीधे हिंदी में बोलें। यह स्वचालित रूप से आपका भाषण लिख देगा!"
                        : "Microphone supports native speech transcription. Your language voice is selected."}
                    </span>
                  </div>
                </div>

                {/* Upload Symptom Visual Photo Box */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    {selectedLanguage === "Hindi" ? "२. फोटो भेजें (वैकल्पिक)" : "2. Visual Symptom Photo (Optional)"}
                  </label>

                  <div className="border-2 border-dashed border-slate-200 hover:border-teal-400 transition-colors rounded-2xl p-4 bg-slate-50/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]">
                    {symptomPhoto ? (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <img 
                          src={symptomPhoto} 
                          alt="Uploaded symptom indicator" 
                          className="max-h-24 rounded-lg object-contain shadow-xs border border-slate-200 mb-2" 
                        />
                        <button
                          onClick={() => setSymptomPhoto(null)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-full shadow-xs active:scale-95 transition-all"
                        >
                          {selectedLanguage === "Hindi" ? "फोटो हटाएं" : "Remove Photo"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="text-slate-400 mb-2 w-8 h-8" size={32} />
                        <span className="text-xs text-slate-500 font-medium mb-1">
                          {t("imageUploadLabel")}
                        </span>
                        <span className="text-[10px] text-slate-400 mb-2">(Supports skin rashes, medication labels, vaccine cards)</span>
                        <input
                          id="file-upload-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload-input"
                          className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          {selectedLanguage === "Hindi" ? "गैलरी से चुनें" : "Select Photo File"}
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Simulator buttons for high-fidelity demonstration without real camera support */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {selectedLanguage === "Hindi" ? "नमूना फोटो सिम्युलेट करें (तेज जाँच के लिए):" : "Simulate Sample Photo:"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedImage("rash");
                          setSymptomText(selectedLanguage === "Hindi" ? "शरीर पर लाल कीड़े के काटने जैसी सूजन और खुजली है" : "I have a sudden itching insect bite red spot");
                        }}
                        className="text-[10px] bg-red-50 hover:bg-red-100 text-red-800 font-semibold px-2 py-1 rounded-md border border-red-150-none transition-all"
                      >
                        🦟 Insect Bite Rash
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedImage("label");
                          setSymptomText(selectedLanguage === "Hindi" ? "क्या मैं इस बुखार की दवा को खाली पेट ले सकता हूँ?" : "Can I take this medication without food?");
                        }}
                        className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md border border-emerald-150 transition-all"
                      >
                        💊 Paracetamol Box Label
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedImage("card");
                          setSymptomText(selectedLanguage === "Hindi" ? "मेरा बच्चा ३ महीने का है, कौन सी वैक्सीन बकाया है?" : "My baby is 3 months old, which vaccines are next?");
                        }}
                        className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold px-2 py-1 rounded-md border border-blue-150 transition-all"
                      >
                        📋 Vaccine Card Photo
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Trigger Button */}
              <div className="mt-2 text-center">
                <button
                  id="submit-symptoms-btn"
                  onClick={handleAnalyzeSymptoms}
                  disabled={analyzing}
                  className={`w-full sm:w-auto min-w-[240px] text-base font-bold text-white px-8 py-3.5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                    analyzing 
                      ? "bg-slate-400 cursor-not-allowed animate-pulse" 
                      : "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20"
                  }`}
                >
                  {analyzing ? t("analyzingText") : t("submitSymptoms")}
                </button>
              </div>

              {/* User Friendly error logs */}
              {errorText && (
                <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold">
                  ⚠️ {errorText}
                </div>
              )}

              {/* Symptom analysis response block */}
              {symptomResult && (
                <div id="results-symptoms" className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 flex flex-col gap-5">
                  
                  {/* Top Level Alert Alert & Severity Gauge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between bg-white p-4 rounded-xl border border-slate-200 gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg shadow-xs ${
                        symptomResult.severity === "Emergency" || symptomResult.severity === "High"
                          ? "bg-red-150 text-red-800 animate-bounce"
                          : symptomResult.severity === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        <ShieldAlert size={24} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-slate-400 font-extrabold tracking-wider">
                          {t("severityLabel")}
                        </h4>
                        <p className={`text-xl font-black ${
                          symptomResult.severity === "Emergency" || symptomResult.severity === "High"
                            ? "text-red-700 font-black animate-pulse"
                            : symptomResult.severity === "Medium"
                            ? "text-amber-700 font-bold"
                            : "text-emerald-700 font-bold"
                        }`}>
                          {symptomResult.severity} (Severity Score: {symptomResult.severityScore}/10)
                        </p>
                      </div>
                    </div>

                    {/* Speech Assistant Audio Player */}
                    {symptomResult.spokenSummary && (
                      <button
                        onClick={() => speakText(symptomResult.spokenSummary)}
                        className={`flex items-center gap-2 text-xs font-bold rounded-xl border px-4 py-2.5 transition-all shadow-xs active:scale-95 ${
                          isPlayingSpeech 
                            ? "bg-red-65 text-red-900 border-red-300 animate-pulse" 
                            : "bg-teal-50 text-teal-900 border-teal-200 hover:bg-teal-100"
                        }`}
                      >
                        {isPlayingSpeech ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        <span>
                          {isPlayingSpeech 
                            ? (selectedLanguage === "Hindi" ? "आवाज रोकें" : "Stop talking")
                            : (selectedLanguage === "Hindi" ? "आवाज में सुनें (सुनें)" : "Listen to audio assistant")}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Immediate Critical Red Flags emergency indicator if present */}
                  {(symptomResult.isEmergency || symptomResult.severity === "Emergency") && (
                    <div className="bg-red-600 text-white p-4 rounded-xl border-1 border-white shadow-md">
                      <h4 className="text-base font-black flex items-center gap-2">
                        <AlertOctagon className="animate-spin text-white" size={20} />
                        {selectedLanguage === "Hindi" ? "अत्यंत आपातकालीन चेतावनी!" : "CRITICAL EMERGENCY RISK DETERMINED!"}
                      </h4>
                      <p className="text-sm mt-1 mb-3 text-red-100 leading-relaxed font-semibold">
                        {symptomResult.emergencyAlert || "Go to nearest PHC immediately. This represents a heavy healthcare risk."}
                      </p>
                    </div>
                  )}

                  {/* Diagnosis conditions listing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left diagnoses description list */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
                        {selectedLanguage === "Hindi" ? "शारीरिक निदान संभावना" : "Potential Clinical Possibilities"}
                      </h4>
                      
                      {symptomResult.diagnoses.map((diag, index) => (
                        <div key={index} className="border-b last:border-b-0 border-slate-100 pb-3 mb-3 last:pb-0 last:mb-0">
                          <p className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            {diag.condition}
                          </p>
                          <span className="inline-block bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 border border-teal-100">
                            Confidence: {diag.confidence}
                          </span>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                            {diag.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Home reliefs panel */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        ☘️ {t("homeCareLabel")}
                      </h4>
                      {symptomResult.diagnoses.map((d, i) => (
                        <div key={i} className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-150">
                          <strong className="text-slate-800 block mb-1">{d.condition} Relief:</strong>
                          {d.homeCare}
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Supportive OTC Medicine Visual Guides */}
                  {symptomResult.recommendedMedicines && symptomResult.recommendedMedicines.length > 0 && (
                    <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg text-lg">
                          💊
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">
                            {selectedLanguage === "Hindi" ? "सहायक औषधियां और खुराक निर्देश" : 
                             selectedLanguage === "Marathi" ? "मदत करणारी औषधे आणि डोस मार्गदर्शक" :
                             selectedLanguage === "Tamil" ? "துணை மருந்துகள் மற்றும் அளவு வழிகாட்டி" :
                             selectedLanguage === "Telugu" ? "సహాయక మందులు & మోతాదు గైడ్" :
                             selectedLanguage === "Bengali" ? "সহায়ক ওষুধ ও ডোজ গাইড" :
                             selectedLanguage === "Kannada" ? "ಸಹಾಯಕ ಔಷಧಿಗಳು ಮತ್ತು ಡೋಸೇಜ್ ಮಾರ್ಗದರ್ಶಿ" :
                             "Supportive Medicines & Dosage Guide"}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {selectedLanguage === "Hindi" ? "ये एआई द्वारा सुझाई गई सामान्य सीमाएं हैं। हमेशा डॉक्टर या आशा कार्यकर्ता से सलाह लें।" : 
                             "AI-suggested general supportive options. Always confirm details with your PHC or ASHA worker."}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {symptomResult.recommendedMedicines.map((med, index) => {
                          // Extract pill details for visual blister rendering
                          const dosageLower = med.dosage.toLowerCase();
                          let morning = true;
                          let noon = dosageLower.includes("three") || dosageLower.includes("3") || dosageLower.includes("noon") || dosageLower.includes("दोपहर");
                          let night = !dosageLower.includes("once") && !dosageLower.includes("सुबह केवल");
                          
                          const themeClass = med.colorTheme === "blue" ? { bg: "bg-blue-50/70 border-blue-200 text-blue-900", accent: "bg-blue-600", pillBg: "bg-blue-500", border: "border-blue-400" } :
                                             med.colorTheme === "red" ? { bg: "bg-rose-50/70 border-rose-200 text-rose-900", accent: "bg-rose-600", pillBg: "bg-rose-500", border: "border-rose-400" } :
                                             med.colorTheme === "green" ? { bg: "bg-emerald-50/70 border-emerald-200 text-emerald-950", accent: "bg-emerald-600", pillBg: "bg-emerald-500", border: "border-emerald-400" } :
                                             med.colorTheme === "yellow" ? { bg: "bg-amber-50/70 border-amber-200 text-amber-950", accent: "bg-amber-600", pillBg: "bg-amber-500", border: "border-amber-400" } :
                                             { bg: "bg-purple-50/70 border-purple-200 text-purple-900", accent: "bg-purple-600", pillBg: "bg-purple-500", border: "border-purple-400" };

                          return (
                            <div key={index} className={`p-4 rounded-xl border flex flex-col justify-between gap-3 shadow-xs ${themeClass.bg}`}>
                              
                              <div className="flex flex-col sm:flex-row gap-4 items-start">
                                
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-slate-900/10 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                      {med.durationDays} {selectedLanguage === "Hindi" ? "दिन का कोर्स" : `Days Course`}
                                    </span>
                                  </div>
                                  
                                  <h5 className="text-base font-extrabold text-slate-800">{med.name}</h5>
                                  
                                  <p className="text-xs text-slate-700 flex items-start gap-1">
                                    <span className="text-slate-655">🎯</span>
                                    <span>
                                      <strong className="font-semibold">{selectedLanguage === "Hindi" ? "उद्देश्य: " : "Purpose: "}</strong>
                                      {med.purpose}
                                    </span>
                                  </p>

                                  <p className="text-xs text-slate-700 flex items-start gap-1">
                                    <span className="text-slate-655">🕒</span>
                                    <span>
                                      <strong className="font-semibold">{selectedLanguage === "Hindi" ? "खुराक: " : "Dosage: "}</strong>
                                      {med.dosage}
                                    </span>
                                  </p>

                                  <p className="text-xs text-slate-700 flex items-start gap-1">
                                    <span className="text-slate-655">💡</span>
                                    <span>
                                      <strong className="font-semibold">{selectedLanguage === "Hindi" ? "कैसे लें: " : "How to use: "}</strong>
                                      {med.howToUse}
                                    </span>
                                  </p>
                                </div>

                                {/* Medicine Visual Container Card acting as "Image of Medicine" */}
                                <div className="bg-white/90 p-2 rounded-xl border border-slate-200 shadow-xs w-full sm:w-[135px] flex flex-col items-center gap-1.5 self-stretch sm:self-start justify-center">
                                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                                    {selectedLanguage === "Hindi" ? "दवाई चित्र" : "MEDICINE BOX"}
                                  </span>

                                  {/* Dynamic visual box rendering */}
                                  <div className="relative w-28 h-16 rounded border border-slate-300 shadow-sm overflow-hidden bg-white flex flex-col justify-between">
                                    {/* Top stripe representing brand/group indicator */}
                                    <div className={`h-2 w-full ${themeClass.accent}`}></div>
                                    
                                    <div className="px-1.5 py-1 flex-1 flex flex-col justify-between">
                                      <div className="leading-none">
                                        <p className="text-[10px] font-bold text-slate-800 truncate leading-none">
                                          {med.name.split(" ")[0]}
                                        </p>
                                        <p className="text-[6px] tracking-tight uppercase text-slate-400 font-bold leading-none mt-1">
                                          {med.durationDays} Days Strip
                                        </p>
                                      </div>
                                      
                                      {/* Illustration of pills or blister points */}
                                      <div className="flex gap-1 justify-center py-1">
                                        <div className={`w-3.5 h-2 rounded-full border ${themeClass.border} ${themeClass.pillBg} opacity-80 shadow-xs shrink-0`}></div>
                                        <div className={`w-3.5 h-2 rounded-full border ${themeClass.border} ${themeClass.pillBg} opacity-80 shadow-xs shrink-0`}></div>
                                        <div className={`w-3.5 h-2 rounded-full border ${themeClass.border} ${themeClass.pillBg} opacity-80 shadow-xs shrink-0`}></div>
                                      </div>
                                    </div>

                                    {/* Medical cross/strip badge */}
                                    <div className="absolute right-1 top-2 bg-rose-500 w-2.5 h-2.5 rounded-full flex items-center justify-center">
                                      <span className="text-white text-[7px] font-bold leading-none">+</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-200"></div>
                                  </div>

                                  {/* Pill schedule tags */}
                                  <div className="flex gap-1 justify-center w-full">
                                    <span className={`text-[8px] font-bold px-1 rounded ${morning ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-300"}`}>
                                      {selectedLanguage === "Hindi" ? "सुबह" : "Morn"}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1 rounded ${noon ? "bg-orange-100 text-orange-850" : "bg-slate-100 text-slate-300"}`}>
                                      {selectedLanguage === "Hindi" ? "दोपहर" : "Noon"}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1 rounded ${night ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-300"}`}>
                                      {selectedLanguage === "Hindi" ? "रात" : "Night"}
                                    </span>
                                  </div>
                                </div>

                              </div>

                              {/* Calendar checklist day tick counter */}
                              <div className="mt-2 bg-white/70 p-2.5 rounded-lg border border-slate-200/60">
                                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                                  <span>📅 {selectedLanguage === "Hindi" ? "खुराक कोर्स पूरा करें:" : "Dosage Days Log (Tap to check):"}</span>
                                  <span className="text-emerald-700 text-[10px] font-black">{med.durationDays} {selectedLanguage === "Hindi" ? "दिन" : "Days total"}</span>
                                </p>
                                
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from({ length: med.durationDays }).map((_, dIdx) => {
                                    const dayNum = dIdx + 1;
                                    return (
                                      <label 
                                        key={dIdx}
                                        className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 px-2 rounded-md cursor-pointer text-xs font-semibold hover:border-emerald-500 transition-all select-none shadow-xxs"
                                      >
                                        <input 
                                          type="checkbox"
                                          className="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                                        />
                                        <span>D{dayNum}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Red flags to monitor */}
                  {symptomResult.redFlags && symptomResult.redFlags.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                      <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">
                        ⚠️ {t("redFlagsLabel")}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-amber-900 leading-relaxed font-semibold">
                        {symptomResult.redFlags.map((flag, i) => (
                          <li key={i}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Government Schemes Integration */}
                  {symptomResult.governmentSchemes && symptomResult.governmentSchemes.length > 0 && (
                    <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl">
                      <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider mb-2">
                        🇮🇳 {t("schemesLabel")}
                      </h4>
                      <div className="space-y-2.5">
                        {symptomResult.governmentSchemes.map((scheme, i) => (
                          <div key={i} className="bg-white/80 p-2.5 rounded-lg border border-teal-150">
                            <strong className="text-teal-900 text-xs block font-bold">{scheme.name}</strong>
                            <p className="text-xs text-slate-750 mt-1 leading-relaxed">
                              {scheme.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scientific guidance info */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <strong>⚕️ Daily Village Sanitation Advice:</strong> {symptomResult.guidance}
                  </div>

                  {/* Local Medical Disclaimer */}
                  <div className="bg-slate-200 text-slate-650 p-3 rounded-lg text-[10px] leading-relaxed border border-slate-300">
                    <strong>⚠️ {t("disclaimerLabel")}:</strong> {symptomResult.disclaimer}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: Custom Local Vaccination schedule & maternal tracker */}
          {activeTab === "vaccines" && (
            <div id="panel-vaccines" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Baby className="text-blue-700" />
                    {selectedLanguage === "Hindi" ? "टीकाकरण और पोषण अनुसूची" : "Vaccination Cover & pregnancy Scheduler"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {selectedLanguage === "Hindi" 
                      ? "बच्चों और गर्भवती माताओं का प्रोफ़ाइल बनाएं, खुराकें ट्रैक करें और समय पर व्हाट्सएप रिमाइंडर पाएं।" 
                      : "Create baby or expecting mother profiles to secure dynamic timeline doses, manage logs, and configure alerts."}
                  </p>
                </div>

                <button
                  id="add-profile-trigger"
                  onClick={() => setShowAddProfile(!showAddProfile)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Plus size={16} />
                  <span>{selectedLanguage === "Hindi" ? "नया प्रोफ़ाइल" : "Add Profile"}</span>
                </button>
              </div>

              {/* Add profile form */}
              {showAddProfile && (
                <form onSubmit={handleAddProfileSubmit} className="bg-slate-50 border border-blue-150 p-5 rounded-2xl flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* Name input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pname" className="text-xs font-bold text-slate-700">Recipient Name</label>
                      <input
                        id="pname"
                        type="text"
                        required
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="E.g. Baby Aarav / Meena Devi"
                        className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-450 focus:outline-hidden"
                      />
                    </div>

                    {/* Profile Type selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-705">Profile Category</label>
                      <select
                        value={newProfileType}
                        onChange={(e: any) => {
                          setNewProfileType(e.target.value);
                          // Set default recommended start age weeks/months
                          setNewProfileAge(e.target.value === "Child" ? 1 : 4);
                        }}
                        className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-450 focus:outline-hidden"
                      >
                        <option value="Child">👶 Child / Baby</option>
                        <option value="Mother">🤰 Expecting Mother</option>
                      </select>
                    </div>

                    {/* Age picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        {newProfileType === "Child" ? "Baby Age (Months)" : "Pregnancy Stage (Weeks)"}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={newProfileType === "Child" ? 64 : 42}
                        value={newProfileAge}
                        onChange={(e) => setNewProfileAge(Number(e.target.value))}
                        className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-450 focus:outline-hidden"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="pcontact" className="text-xs font-bold text-slate-700">Mobile No. (for SMS)</label>
                      <input
                        id="pcontact"
                        type="tel"
                        value={newProfileContact}
                        onChange={(e) => setNewProfileContact(e.target.value)}
                        placeholder="+91 9900000000"
                        className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-450 focus:outline-hidden"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProfile(false)}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-xs px-4 py-2 rounded-lg font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-750 text-white text-xs px-5 py-2 rounded-lg font-extrabold"
                    >
                      Save Profile & Get Schedule
                    </button>
                  </div>
                </form>
              )}

              {/* Profiles layout */}
              <div className="flex flex-col gap-6">
                {profiles.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No active vaccination profiles found. Start by creating one for clinical tracking.
                  </div>
                ) : (
                  profiles.map((profile) => {
                    const completed = profile.vaccines.filter(v => v.status === "Given").length;
                    const total = profile.vaccines.length;
                    const percent = Math.round((completed / total) * 100) || 0;

                    return (
                      <div key={profile.id} className="border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-350 transition-all bg-white relative">
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                          
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${profile.type === "Child" ? "bg-blue-100 text-blue-850" : "bg-fuchsia-100 text-fuchsia-850"}`}>
                              {profile.type === "Child" ? <Baby size={22} /> : <User size={22} />}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {profile.name}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  profile.type === "Child" ? "bg-blue-200 text-blue-900" : "bg-fuchsia-200 text-fuchsia-900"
                                }`}>
                                  {profile.type === "Child" ? "Child Vaccine Program" : "Maternal Care Tracker"}
                                </span>
                              </h3>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Age/Stage: {profile.type === "Child" ? `${profile.ageInMonths} months old` : `${profile.ageInMonths * 4} Weeks Pregnant`} · Contact No: {profile.contactNumber}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <button
                              onClick={() => deleteProfile(profile.id)}
                              className="text-xs text-red-650 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Profile"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                        </div>

                        {/* Custom visual progress bar of immunization coverage */}
                        <div className="mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                            <span>Immunization Coverage</span>
                            <span className="text-blue-700">{completed} of {total} Doses given ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        {/* List of vaccines with status toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {profile.vaccines.map((vaccine) => (
                            <div 
                              key={vaccine.id} 
                              className={`p-3 rounded-xl border transition-all ${
                                vaccine.status === "Given"
                                  ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                                  : "bg-slate-50/20 border-slate-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs text-slate-400 font-extrabold tracking-wider mb-0.5">
                                    {vaccine.recommendedAge}
                                  </p>
                                  <h4 className="text-sm font-bold text-slate-800">
                                    {vaccine.name}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {vaccine.description}
                                  </p>
                                  {vaccine.givenDate && (
                                    <p className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
                                      <CheckCircle size={12} /> Given on: {vaccine.givenDate}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => toggleVaccineStatus(profile.id, vaccine.id)}
                                  className={`text-xs font-bold py-1 px-3 rounded-lg transition-all ${
                                    vaccine.status === "Given"
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                      : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
                                  }`}
                                >
                                  {vaccine.status === "Given" ? "Given" : "Mark Done"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Dynamic simulated alert manager */}
              <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-extrabold text-slate-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Volume2 size={16} />
                  {t("vaccineAlertSim")}
                </h3>
                <div className="bg-slate-950 font-mono text-[11px] text-slate-300 p-3 rounded-lg max-h-[140px] overflow-y-auto space-y-1.5 leading-relaxed">
                  {simulatedAlertLogs.map((log, i) => (
                    <div key={i} className="border-b border-slate-900 pb-1.5 last:border-b-0">
                      <span className="text-teal-400 font-bold">{log.slice(0, 13)}</span>
                      {log.slice(13)}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Disease Outbreak Forecast Panel */}
          {activeTab === "outbreaks" && (
            <div id="panel-outbreaks" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertOctagon className="text-red-700" />
                  {selectedLanguage === "Hindi" ? "ग्रामीण संक्रामक बीमारी और मौसम खतरा पूर्वानुमान" : "Regional Spatio-Temporal Outbreak Forecast"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedLanguage === "Hindi" 
                    ? "मौसम डेटा और सरकारी रिपोर्टों के आधार पर मलेरिया, डेंगू और लू (हीटस्ट्रोक) के खतरों की जानकारी।" 
                    : "Simulating vector-borne and thermal hazard analysis based on dynamic precipitation registers and clinic logs."}
                </p>
              </div>

              {/* Select region selector */}
              <div className="flex flex-col sm:flex-row items-baseline gap-3">
                <span className="text-sm font-bold text-slate-700">Choose Region Monitoring Unit:</span>
                <div className="flex flex-wrap gap-1.5">
                  {OUTBREAK_FORECASTS.map((out) => (
                    <button
                      key={out.region}
                      onClick={() => setSelectedRegion(out.region)}
                      className={`text-xs font-semibold py-1.5 px-3.5 rounded-lg border transition-all ${
                        selectedRegion === out.region
                          ? "bg-red-50 text-red-900 border-red-300 shadow-xs ring-2 ring-red-200"
                          : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      📍 {out.region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Risk cards side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Dengue Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between min-h-[160px]">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">🦟 DENGUE FEVER RISK</span>
                    <strong className={`text-3xl font-black ${
                      currentOutbreak.dengueRisk === "High" ? "text-red-700" : currentOutbreak.dengueRisk === "Medium" ? "text-amber-700" : "text-emerald-700"
                    }`}>
                      {currentOutbreak.dengueRisk}
                    </strong>
                  </div>
                  <div className="w-full mt-4">
                    <span className="text-[10px] text-slate-400 block mb-1">Risk Vector Trend</span>
                    <div className="bg-slate-200 h-2.5 rounded-xl overflow-hidden flex">
                      <div className="bg-red-600 h-full" style={{ width: currentOutbreak.dengueRisk === "High" ? "90%" : currentOutbreak.dengueRisk === "Medium" ? "50%" : "20%" }} />
                    </div>
                  </div>
                </div>

                {/* Malaria Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between min-h-[160px]">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">🦟 MALARIA RISK</span>
                    <strong className={`text-3xl font-black ${
                      currentOutbreak.malariaRisk === "High" ? "text-red-700" : currentOutbreak.malariaRisk === "Medium" ? "text-amber-700" : "text-emerald-700"
                    }`}>
                      {currentOutbreak.malariaRisk}
                    </strong>
                  </div>
                  <div className="w-full mt-4">
                    <span className="text-[10px] text-slate-400 block mb-1">Mosquito Breeding Forecast</span>
                    <div className="bg-slate-200 h-2.5 rounded-xl overflow-hidden flex">
                      <div className="bg-amber-500 h-full" style={{ width: currentOutbreak.malariaRisk === "High" ? "85%" : currentOutbreak.malariaRisk === "Medium" ? "55%" : "15%" }} />
                    </div>
                  </div>
                </div>

                {/* Heatstroke Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-between min-h-[160px]">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">☀️ HEATSTROKE ALERT</span>
                    <strong className={`text-3xl font-black ${
                      currentOutbreak.heatstrokeRisk === "High" ? "text-red-700" : currentOutbreak.heatstrokeRisk === "Medium" ? "text-amber-700" : "text-emerald-700"
                    }`}>
                      {currentOutbreak.heatstrokeRisk}
                    </strong>
                  </div>
                  <div className="w-full mt-4">
                    <span className="text-[10px] text-slate-400 block mb-1">Thermal Risk Index</span>
                    <div className="bg-slate-200 h-2.5 rounded-xl overflow-hidden flex">
                      <div className="bg-orange-550 h-full" style={{ width: currentOutbreak.heatstrokeRisk === "High" ? "92%" : currentOutbreak.heatstrokeRisk === "Medium" ? "45%" : "10%" }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic outbreak safety bulletin card */}
              <div className="bg-amber-50 border border-amber-250 p-5 rounded-2xl flex items-start gap-4">
                <ShieldAlert className="text-amber-700 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <h4 className="text-base font-bold text-amber-900">
                    {selectedLanguage === "Hindi" ? "महत्वपूर्ण क्षेत्र स्वास्थ्य सावधानियां" : "Monsoon & Sanitation Preventive Bulletin"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-750 mt-1.5 leading-relaxed font-medium">
                    {currentOutbreak.alertMessage}
                  </p>
                </div>
              </div>

              {/* Custom SVG dynamic chart representing risk tracking */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp size={15} /> Combined Hazard Risk Trend Analysis (5-Week Forecast)
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Stable vs Peak Hazards</span>
                </div>

                <div className="flex items-end justify-between h-32 gap-3.5 pt-4 border-b border-slate-200 px-4">
                  {currentOutbreak.weeklyRiskTrend.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-650">{val}%</span>
                      <div 
                        className="w-full bg-teal-500 rounded-t-lg transition-all duration-500" 
                        style={{ height: `${val}%`, backgroundColor: val > 75 ? "#dc2626" : val > 45 ? "#f59e0b" : "#10b981" }}
                      />
                      <span className="text-[10px] font-semibold text-slate-400">Week {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Healthcare center / PHC / Clinic Finder with routing guide */}
          {activeTab === "centers" && (
            <div id="panel-centers" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="text-teal-700" />
                  {selectedLanguage === "Hindi" ? "नजदीकी अस्पताल और प्राथमिक स्वास्थ्य केंद्र (PHC) खोजें" : "Nearest Government Health Clinic Finder"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedLanguage === "Hindi" 
                    ? "भारत के गांवों में स्थित प्रमाणित सरकारी अस्पतालों, टीकाकरण बूथ और एम्बुलेंस सेंटरों की सूची।" 
                    : "Authentic contact registry, vaccine cold-storage chains, and hospital bed counts indexed by PIN/Town."}
                </p>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={phcSearchQuery}
                  onChange={(e) => setPhcSearchQuery(e.target.value)}
                  placeholder={t("searchPHC")}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800"
                />
              </div>

              {/* Listing hospitals */}
              <div className="flex flex-col gap-4">
                {searchedCenters.length === 0 ? (
                  <div className="text-center py-6 text-slate-405">
                    No registered Primary Health Units or Hospitals found for your search term. Feel free to search with popular locations (such as "Pune", "Patna", "West Bengal", "412202").
                  </div>
                ) : (
                  searchedCenters.map((center, index) => (
                    <div 
                      key={index} 
                      className="border border-slate-205 hover:border-slate-300 mx-0 p-4 sm:p-5 rounded-2xl bg-white transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-teal-55 text-teal-800">
                          <MapPin size={22} />
                        </div>
                        <div>
                          <span className="inline-block bg-teal-100 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 uppercase">
                            {center.type} · {center.distance} Close
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-850">
                            {center.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            📍 {center.city} Area, {center.state} - PIN {center.pinCode}
                          </p>

                          {/* Beds and generic care counters */}
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-slate-650 bg-slate-100 px-2 py-1 rounded-sm border border-slate-150">
                              🛏️ {center.bedCount} Registered Village Beds
                            </span>
                            <span className="text-xs text-slate-650 bg-slate-100 px-2 py-1 rounded-sm border border-slate-150">
                              📞 contact: {center.phone}
                            </span>
                          </div>

                          {/* List of services */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {center.services.map((ser, i) => (
                              <span key={i} className="bg-slate-50 text-slate-600 border border-slate-150 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                ✓ {ser}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Direction Routing simulation buttons */}
                      <div className="self-end sm:self-start">
                        <a 
                          href={`tel:${center.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-xs active:scale-95"
                        >
                          <Phone size={14} className="text-slate-500" />
                          <span>Call Clinic</span>
                        </a>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 5: AI-Powered Misinformation Detection & Common Village Myth Buster */}
          {activeTab === "myths" && (
            <div id="panel-myths" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="text-amber-600 animate-pulse" />
                  {selectedLanguage === "Hindi" ? "ग्रामीण स्वास्थ्य अफवाह और अंधविश्वास निवारक" : "AI Rural Medical Misinformation Shield"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedLanguage === "Hindi" 
                    ? "टीके, दवाओं या जड़ी-बूटियों के बारे में सुनी-सुनाई बातों का वैज्ञानिक सच जानें। हमारा AI अफवाह को सच से अलग करता है।" 
                    : "Instantly fact-check local medical practices, vaccine skeptics, and traditional village remedies via AI MoHFW registry."}
                </p>
              </div>

              {/* Myth query text box */}
              <div className="flex flex-col gap-3">
                <label htmlFor="myth-search-box" className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  Verify a Rumor or Community Rumor Statement:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="myth-search-box"
                    type="text"
                    value={mythQuery}
                    onChange={(e) => setMythQuery(e.target.value)}
                    placeholder={t("mythInputPlaceholder")}
                    className="flex-1 bg-slate-50/50 border border-slate-200 p-3 rounded-2xl text-base focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800"
                  />
                  <button
                    onClick={() => handleMythSubmit()}
                    disabled={mythLoading}
                    className={`sm:w-auto font-bold text-white px-7 py-3 rounded-xl shadow-md transition-all ${
                      mythLoading ? "bg-slate-450 animate-pulse cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-800"
                    }`}
                  >
                    {mythLoading ? "Verifying..." : "Verify Rumor"}
                  </button>
                </div>
              </div>

              {/* Displays preloaded fact sheets for rapid user interactions */}
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-extrabold text-slate-405 uppercase tracking-wide">
                  💡 Tap Popular Community Rumor Statements to instantly fact-check:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {PRE_LOADED_MYTHS.map((myth) => (
                    <button
                      key={myth.id}
                      onClick={() => {
                        setMythQuery(selectedLanguage === "Hindi" ? myth.mythLocal : myth.mythEn);
                        handleMythSubmit(selectedLanguage === "Hindi" ? myth.mythLocal : myth.mythEn);
                      }}
                      className="border border-slate-200 hover:border-amber-300 p-4 rounded-xl text-left hover:bg-slate-50 transition-all font-sans"
                    >
                      <span className="text-[10px] font-extrabold text-amber-705 uppercase block mb-1">🏥 Myth Rumor Statement</span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        "{selectedLanguage === "Hindi" ? myth.mythLocal : myth.mythEn}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Myth buster response panel */}
              {mythResponse && (
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between border-b pb-3 border-slate-150 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Rumor Statement Checked</span>
                      <p className="text-sm font-black text-slate-800 italic">
                        "{mythResponse.statement}"
                      </p>
                    </div>
                    <span className={`text-base font-extrabold py-1 px-3.5 rounded-lg border uppercase ${
                      mythResponse.isMyth 
                        ? "bg-red-50 text-red-900 border-red-250 animate-pulse text-center" 
                        : "bg-emerald-50 text-emerald-900 border-emerald-250 text-center"
                    }`}>
                      Verdict: {mythResponse.verdict}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-slate-405 uppercase tracking-wide flex items-center gap-1">
                      <FileCheck className="text-emerald-700" size={15} /> Scientific Evidence & Clinical Reality
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-850 leading-relaxed font-semibold">
                      {mythResponse.scientificExplanation}
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg text-xs flex items-start gap-2 text-teal-900">
                    <Info className="flex-shrink-0 mt-0.5 text-teal-850" size={15} />
                    <div>
                      <strong>{t("govtRefLabel")}:</strong> {mythResponse.governmentReferences}
                    </div>
                  </div>

                  {/* Speech Option */}
                  {mythResponse.spokenSummary && (
                    <button
                      onClick={() => speakText(mythResponse.spokenSummary)}
                      className={`inline-flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-xl border self-start ${
                        isPlayingSpeech ? "bg-red-65 border-red-300 text-red-900" : "bg-teal-50 border-teal-205 text-teal-905"
                      }`}
                    >
                      {isPlayingSpeech ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      <span>{isPlayingSpeech ? "Stop Speech" : "Listen in Speech Assistant"}</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 6: ASHA worker special survey assistant and household tracking mode */}
          {activeTab === "asha" && (
            <div id="panel-asha" className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6">
              
              <div className="border-b border-indigo-100 pb-4">
                <span className="bg-indigo-100 text-indigo-900 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase mb-2 inline-block tracking-wider">
                  🔐 Certified Accredited Health Volunteer Mode
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="text-indigo-700" />
                  ASHA / Auxiliary Midwife Rural Assistant Platform
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Private localized system for community health workers to register newly surveyed micro-households, track offline vaccine logs, and submit visit reports.
                </p>
              </div>

              {/* Core analytics dashboard inside ASHA mode */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">SURVEYED HOMES</span>
                  <strong className="text-3xl text-indigo-950 font-black tracking-tight">{households.length}</strong>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">MEMBER LEDGER</span>
                  <strong className="text-3xl text-indigo-950 font-black tracking-tight">
                    {households.reduce((acc, h) => acc + h.familyCount, 0)}
                  </strong>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">IMMUNIZATION COVER REG</span>
                  <strong className="text-3xl text-indigo-950 font-black tracking-tight">81.5%</strong>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center animate-pulse">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block mb-1">CLINIC VAX STOCK</span>
                  <strong className="text-xl text-red-950 font-black tracking-tight">Optimal</strong>
                </div>
              </div>

              {/* Register newly surveyed house form */}
              <div className="bg-slate-50 border border-indigo-150 p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText size={16} className="text-indigo-750" /> Register New Micro-Household Survey
                </h3>
                
                <form onSubmit={handleRegisterHousehold} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  
                  {/* Head Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phead" className="text-xs font-bold text-slate-700">{t("ashaHouseholdHead")}</label>
                    <input
                      id="phead"
                      type="text"
                      required
                      value={newHouseHead}
                      onChange={(e) => setNewHouseHead(e.target.value)}
                      placeholder="E.g. Ram Charan"
                      className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-450 focus:outline-hidden"
                    />
                  </div>

                  {/* Village Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pvillage" className="text-xs font-bold text-slate-700">{t("ashaVillageName")}</label>
                    <input
                      id="pvillage"
                      type="text"
                      required
                      value={newHouseVillage}
                      onChange={(e) => setNewHouseVillage(e.target.value)}
                      placeholder="E.g. Uruli Kanchan"
                      className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-455 focus:outline-hidden"
                    />
                  </div>

                  {/* Members count */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pcount" className="text-xs font-bold text-slate-705">{t("ashaFamilyCount")}</label>
                    <input
                      id="pcount"
                      type="number"
                      required
                      min={1}
                      max={20}
                      value={newHouseCount}
                      onChange={(e) => setNewHouseCount(Number(e.target.value))}
                      className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-450 focus:outline-hidden"
                    />
                  </div>

                  {/* Notes / Health Alerts */}
                  <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label htmlFor="pnotes" className="text-xs font-bold text-slate-700">Remarks / Specific Risks</label>
                    <input
                      id="pnotes"
                      type="text"
                      value={newHouseNotes}
                      onChange={(e) => setNewHouseNotes(e.target.value)}
                      placeholder="E.g. Fever case found, child needs BCG"
                      className="border border-slate-200 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-450 focus:outline-hidden"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                    <button
                      type="submit"
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg active:scale-95 transition-all shadow-xs"
                    >
                      {t("ashaRegisterBtn")}
                    </button>
                  </div>

                </form>
              </div>

              {/* Listing current households ledger */}
              <div>
                <h3 className="text-sm font-bold text-slate-805 mb-3 uppercase tracking-wide">
                  {t("ashaRegisteredList")}
                </h3>
                
                <div className="flex flex-col gap-3">
                  {households.map((house) => (
                    <div key={house.id} className="border border-slate-205 p-4 rounded-xl bg-white hover:border-indigo-305 transition-all flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-505"></span>
                          <h4 className="text-sm font-bold text-slate-900">
                            Head: {house.headName} ({house.familyCount} Family Members)
                          </h4>
                        </div>
                        <p className="text-xs text-slate-505 mt-1">
                          Village Unit: <strong>{house.villageName}</strong> · Surveyed Case Remark: <span className="italic">"{house.notes}"</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-1 rounded-sm border border-emerald-150-none">
                          ✓ Immunized Coverage Check: {house.immunizationPercentage}%
                        </span>
                        <button
                          onClick={() => deleteHousehold(house.id)}
                          className="text-xs text-red-600 hover:text-red-700 p-1 rounded-md"
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

      {/* 4. SwasthyaMitra Community Resource Hub Footer */}
      <footer id="swasthya-footer" className="bg-slate-900 text-white border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          
          <div>
            <h4 className="font-extrabold text-teal-400 mb-3 uppercase tracking-widest text-xs">
              SwasthyaMitra Mission
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              SwasthyaMitra has been engineered using advanced spatio-temporal predictions, AI-driven visual diagnosis analysis, and responsive vocal interaction systems to bypass literacy barriers in rural and regional rural India.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-teal-400 mb-3 uppercase tracking-widest text-xs">
              Indian Healthcare Schemes Covered
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>✓ Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)</li>
              <li>✓ Janani Suraksha Yojana (JSY) - Maternal Health Delivery Coverage</li>
              <li>✓ Mission Indradhanush (Universal Routine Immunization coverage)</li>
              <li>✓ National Rural Health Mission (NRHM) local support clinics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-teal-400 mb-3 uppercase tracking-widest text-xs">
              Important Emergency Contacts
            </h4>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
              <p className="font-bold flex justify-between">
                <span>🚑 Local Ambulance:</span>
                <span className="text-red-400 font-mono">108 / 102</span>
              </p>
              <p className="font-bold flex justify-between">
                <span>🤰 Maternal Transport Unit:</span>
                <span className="text-teal-400 font-mono">102</span>
              </p>
              <p className="font-bold flex justify-between">
                <span>🛡️ Family Health Helpline:</span>
                <span className="text-teal-400 font-mono">104</span>
              </p>
              <p className="font-bold flex justify-between">
                <span>🏥 MoHFW Central Helpdesk:</span>
                <span className="text-teal-400 font-mono">1800-11-0456</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto text-center text-slate-500 text-[10px] sm:text-xs pt-6 border-t border-slate-850 mt-6 leading-relaxed">
          SwasthyaMitra is an AI and rules-assisted digital advisory platform for semi-urban communities. It does not replace physical physical medical diagnoses by qualified clinical medical officers. Use carefully.
        </div>
      </footer>

    </div>
  );
}
