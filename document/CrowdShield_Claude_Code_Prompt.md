# CrowdShield - Claude Code Development Prompt

## 🎯 Project Overview

สร้าง **CrowdShield** - Community-Driven Fraud Detection Platform สำหรับ Samsung × KBTG Digital Fraud Cybersecurity Hackathon

**Tagline:** "ป้องกันภัย ไม่สอดส่อง | เข้าใจ ไม่ควบคุม" (Protect without Spying | Understand without Controlling)

---

## 📋 Context & Background

### ปัญหาที่ต้องการแก้ไข
- ประเทศไทยตรวจพบ 168 ล้านสาย/SMS หลอกลวงในปี 2024 (เพิ่มขึ้น 112%)
- ความเสียหายมากกว่า 60,000 ล้านบาทต่อปี
- 89% ของคนไทยเคยพบการหลอกลวงออนไลน์
- 75.3% ของผู้สูงอายุ (13 ล้านคน) เคยตกเป็นเหยื่อ

### Insight สำคัญจากตำรวจ
รูปแบบ Scam ที่พบบ่อยที่สุดคือ **Coercion Scenario** - มิจฉาชีพบังคับให้เหยื่อไปทำธุรกรรมที่ ATM ขณะคุยโทรศัพท์ หากตรวจจับ pattern นี้ได้:
- สายจากคนแปลกหน้า + 
- ยืนหน้า ATM + 
- ข้อความขอโอนเงิน
= สามารถป้องกันความเสียหายได้

### Hackathon Theme
**Theme 1: AI-Powered Fraud Detection & Prevention**
- AI models for transaction anomaly detection
- Behavioral analytics for early fraud signals
- Anti-phishing or scam voice/SMS detection

### Sponsors & Partners
- **Samsung**: Knox security, Smart Call, Auto Blocker
- **KBTG**: K PLUS 22M users, Deep Tech APIs
- **Google Cloud**: Vertex AI, Web Risk API, reCAPTCHA
- **SAS**: Enterprise fraud analytics
- **NCSA Thailand**: AOC 1441, regulatory compliance

---

## 🏗️ Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER'S DEVICE                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Call Monitor│  │SMS/Chat     │  │ Location    │              │
│  │ (Android)   │  │Analyzer     │  │ Context     │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│              ┌───────────────────────┐                          │
│              │  On-Device ML Engine  │                          │
│              │  (TensorFlow Lite)    │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
│                          ▼                                       │
│              ┌───────────────────────┐                          │
│              │    Risk Assessment    │◄──── Knox Attestation    │
│              │    Engine             │                          │
│              └───────────┬───────────┘                          │
│                          │                                       │
│         ┌────────────────┼────────────────┐                      │
│         ▼                ▼                ▼                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │Adaptive UI  │  │ Family      │  │ Community   │              │
│  │Warning      │  │ Alert       │  │ Report      │              │
│  └─────────────┘  └─────────────┘  └──────┬──────┘              │
│                                           │                      │
└───────────────────────────────────────────┼──────────────────────┘
                                            │
                    ════════════════════════╪════════════════════
                         Privacy Boundary   │  (Anonymized only)
                    ════════════════════════╪════════════════════
                                            │
                                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      CROWDSHIELD CLOUD                           │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐      ┌─────────────────┐                   │
│  │ Federated       │      │ Threat          │                   │
│  │ Learning Server │◄────►│ Intelligence    │                   │
│  │ (Flower + GCP)  │      │ Database        │                   │
│  └────────┬────────┘      └────────┬────────┘                   │
│           │                        │                             │
│           ▼                        ▼                             │
│  ┌─────────────────────────────────────┐                        │
│  │         External Integrations        │                        │
│  │  • Google Safe Browsing API          │                        │
│  │  • NCSA/AOC 1441 Database           │                        │
│  │  • Bank Mule Account Registry       │                        │
│  └─────────────────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

### ML Ensemble Model

```
              ┌─────────────────────────────────────┐
              │         INPUT SIGNALS               │
              │  • Call metadata                    │
              │  • Message text                     │
              │  • Location context                 │
              │  • User behavior patterns           │
              └─────────────┬───────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   MobileNetV2   │ │      LSTM       │ │   Rule-based    │
│      Text       │ │   Behavioral    │ │    Context      │
│   Classifier    │ │    Anomaly      │ │    Scorer       │
│   (4.2 MB)      │ │   (2.8 MB)      │ │   (0.5 MB)      │
│  Weight: 0.4    │ │  Weight: 0.35   │ │  Weight: 0.25   │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
              ┌─────────────────────────────────────┐
              │      WEIGHTED ENSEMBLE              │
              │  Final Score = Σ(weight × score)    │
              │  Output: Risk Score 0-100           │
              └─────────────────────────────────────┘
```

### Risk Level Actions

| Level | Score | UI Action | System Action |
|-------|-------|-----------|---------------|
| Safe | 0-49% | No interruption | Log, monitor |
| Medium | 50-69% | Subtle banner | Increase monitoring |
| High | 70-84% | Full-screen warning, 10s delay | Prepare family alert |
| Critical | 85-100% | Emergency alert, family notification | Community report |

---

## 📁 Repository Structure

สร้าง repository structure ดังนี้:

```
crowdshield-2.0/
├── README.md                          # Project overview with badges & screenshots
├── LICENSE                            # MIT License
├── .gitignore
├── CONTRIBUTING.md
│
├── docs/
│   ├── ARCHITECTURE.md                # Technical architecture details
│   ├── API.md                         # API specifications
│   ├── PRIVACY.md                     # Privacy & security design
│   ├── DEMO_SCRIPT.md                 # Demo scenario script
│   └── images/
│       ├── architecture.png
│       ├── detection-flow.png
│       └── screenshots/
│
├── android/                           # Android Application
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/crowdshield/
│   │   │   │   │   ├── CrowdShieldApp.kt
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   │
│   │   │   │   │   ├── detection/
│   │   │   │   │   │   ├── ScamDetectionEngine.kt
│   │   │   │   │   │   ├── TextAnalyzer.kt
│   │   │   │   │   │   ├── BehaviorAnalyzer.kt
│   │   │   │   │   │   └── RiskAssessment.kt
│   │   │   │   │   │
│   │   │   │   │   ├── location/
│   │   │   │   │   │   ├── GeofenceManager.kt
│   │   │   │   │   │   ├── ATMDetector.kt
│   │   │   │   │   │   └── LocationService.kt
│   │   │   │   │   │
│   │   │   │   │   ├── call/
│   │   │   │   │   │   ├── CallMonitorService.kt
│   │   │   │   │   │   └── CallScreeningService.kt
│   │   │   │   │   │
│   │   │   │   │   ├── ui/
│   │   │   │   │   │   ├── theme/
│   │   │   │   │   │   │   ├── Color.kt
│   │   │   │   │   │   │   ├── Theme.kt
│   │   │   │   │   │   │   └── Typography.kt
│   │   │   │   │   │   ├── screens/
│   │   │   │   │   │   │   ├── HomeScreen.kt
│   │   │   │   │   │   │   ├── AnalyzeScreen.kt
│   │   │   │   │   │   │   ├── WarningScreen.kt
│   │   │   │   │   │   │   ├── ReportScreen.kt
│   │   │   │   │   │   │   └── SettingsScreen.kt
│   │   │   │   │   │   └── components/
│   │   │   │   │   │       ├── RiskScoreIndicator.kt
│   │   │   │   │   │       ├── WarningCard.kt
│   │   │   │   │   │       ├── MessageInput.kt
│   │   │   │   │   │       └── FamilyAlertButton.kt
│   │   │   │   │   │
│   │   │   │   │   ├── reporting/
│   │   │   │   │   │   ├── CommunityReportManager.kt
│   │   │   │   │   │   └── AnonymousReporter.kt
│   │   │   │   │   │
│   │   │   │   │   ├── ml/
│   │   │   │   │   │   ├── TFLiteModelLoader.kt
│   │   │   │   │   │   ├── TextClassifier.kt
│   │   │   │   │   │   └── ThaiTokenizer.kt
│   │   │   │   │   │
│   │   │   │   │   ├── data/
│   │   │   │   │   │   ├── models/
│   │   │   │   │   │   │   ├── RiskScore.kt
│   │   │   │   │   │   │   ├── ScamReport.kt
│   │   │   │   │   │   │   └── ThreatSignature.kt
│   │   │   │   │   │   └── repository/
│   │   │   │   │   │       ├── ThreatRepository.kt
│   │   │   │   │   │       └── ReportRepository.kt
│   │   │   │   │   │
│   │   │   │   │   └── utils/
│   │   │   │   │       ├── HashUtils.kt
│   │   │   │   │       ├── PrivacyUtils.kt
│   │   │   │   │       └── ThaiTextUtils.kt
│   │   │   │   │
│   │   │   │   ├── res/
│   │   │   │   │   ├── values/
│   │   │   │   │   │   ├── strings.xml
│   │   │   │   │   │   ├── strings-th.xml     # Thai localization
│   │   │   │   │   │   └── colors.xml
│   │   │   │   │   ├── drawable/
│   │   │   │   │   └── raw/
│   │   │   │   │       └── scam_detector.tflite
│   │   │   │   │
│   │   │   │   └── AndroidManifest.xml
│   │   │   │
│   │   │   └── test/
│   │   │       └── java/com/crowdshield/
│   │   │           ├── detection/
│   │   │           │   └── ScamDetectionEngineTest.kt
│   │   │           └── ml/
│   │   │               └── TextClassifierTest.kt
│   │   │
│   │   └── build.gradle.kts
│   │
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   └── README.md
│
├── backend/                           # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app entry point
│   │   ├── config.py                  # Configuration
│   │   │
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── reports.py         # POST /reports/submit
│   │   │   │   ├── threats.py         # GET /threats/check
│   │   │   │   ├── model.py           # GET /model/latest
│   │   │   │   └── health.py          # Health check
│   │   │   └── dependencies.py
│   │   │
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── threat_intelligence.py
│   │   │   ├── report_aggregator.py
│   │   │   └── model_manager.py
│   │   │
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── federated_server.py    # Flower FL server
│   │   │   └── aggregation.py         # FedAvg implementation
│   │   │
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   ├── models.py              # SQLAlchemy models
│   │   │   ├── schemas.py             # Pydantic schemas
│   │   │   └── crud.py                # CRUD operations
│   │   │
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── privacy.py             # Differential privacy
│   │       └── hash.py                # Hashing utilities
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_reports.py
│   │   └── test_threats.py
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── ml/                                # ML Training & Models
│   ├── notebooks/
│   │   ├── 01_data_exploration.ipynb
│   │   ├── 02_thai_scam_classifier.ipynb
│   │   ├── 03_behavioral_anomaly.ipynb
│   │   └── 04_model_export.ipynb
│   │
│   ├── src/
│   │   ├── __init__.py
│   │   ├── data/
│   │   │   ├── __init__.py
│   │   │   ├── preprocessor.py
│   │   │   └── thai_tokenizer.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── text_classifier.py
│   │   │   └── behavior_detector.py
│   │   └── training/
│   │       ├── __init__.py
│   │       ├── trainer.py
│   │       └── federated_client.py
│   │
│   ├── models/                        # Exported models
│   │   ├── scam_detector.tflite
│   │   └── behavior_detector.tflite
│   │
│   ├── data/                          # Sample data (anonymized)
│   │   └── sample_scam_messages.json
│   │
│   ├── requirements.txt
│   └── README.md
│
├── demo/                              # Demo materials
│   ├── screenshots/
│   │   ├── 01_home_screen.png
│   │   ├── 02_analyze_message.png
│   │   ├── 03_risk_detection.png
│   │   ├── 04_warning_screen.png
│   │   └── 05_community_report.png
│   │
│   ├── video/
│   │   └── demo_script.md
│   │
│   └── presentation/
│       ├── pitch_deck.pdf
│       └── technical_overview.pdf
│
└── scripts/
    ├── setup.sh                       # Development setup
    ├── build_android.sh               # Build Android APK
    ├── deploy_backend.sh              # Deploy to GCP
    └── run_demo.sh                    # Run demo scenario
```

---

## 🎯 Implementation Tasks

### Phase 1: Project Setup & Documentation

```bash
# Task 1.1: Initialize repository
mkdir crowdshield-2.0
cd crowdshield-2.0
git init

# Task 1.2: Create README.md with badges and overview
# Task 1.3: Create documentation files
# Task 1.4: Setup .gitignore for Android, Python, etc.
```

### Phase 2: Android Application

#### Task 2.1: Project Setup
```kotlin
// build.gradle.kts (app level)
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
}

android {
    namespace = "com.crowdshield"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.crowdshield"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }
    
    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    // TensorFlow Lite
    implementation("org.tensorflow:tensorflow-lite:2.14.0")
    implementation("org.tensorflow:tensorflow-lite-support:0.4.4")
    
    // Location Services
    implementation("com.google.android.gms:play-services-location:21.0.1")
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    
    // Networking
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    
    // Hilt DI
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-compiler:2.48")
    
    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
}
```

#### Task 2.2: Core Detection Engine
```kotlin
// ScamDetectionEngine.kt
class ScamDetectionEngine @Inject constructor(
    private val textAnalyzer: TextAnalyzer,
    private val behaviorAnalyzer: BehaviorAnalyzer,
    private val contextScorer: ContextScorer
) {
    companion object {
        const val TEXT_WEIGHT = 0.4f
        const val BEHAVIOR_WEIGHT = 0.35f
        const val CONTEXT_WEIGHT = 0.25f
    }
    
    data class DetectionResult(
        val riskScore: Int,           // 0-100
        val riskLevel: RiskLevel,
        val signals: List<SignalType>,
        val recommendation: String
    )
    
    enum class RiskLevel {
        SAFE,      // 0-49
        MEDIUM,    // 50-69
        HIGH,      // 70-84
        CRITICAL   // 85-100
    }
    
    suspend fun analyzeMessage(
        message: String,
        callContext: CallContext?,
        locationContext: LocationContext?
    ): DetectionResult {
        // 1. Text analysis
        val textScore = textAnalyzer.analyze(message)
        
        // 2. Behavioral analysis
        val behaviorScore = behaviorAnalyzer.analyze(callContext)
        
        // 3. Context scoring
        val contextScore = contextScorer.score(locationContext, callContext)
        
        // 4. Weighted ensemble
        val finalScore = (
            textScore * TEXT_WEIGHT +
            behaviorScore * BEHAVIOR_WEIGHT +
            contextScore * CONTEXT_WEIGHT
        ).toInt().coerceIn(0, 100)
        
        return DetectionResult(
            riskScore = finalScore,
            riskLevel = getRiskLevel(finalScore),
            signals = collectSignals(textScore, behaviorScore, contextScore),
            recommendation = getRecommendation(finalScore)
        )
    }
    
    private fun getRiskLevel(score: Int): RiskLevel = when {
        score < 50 -> RiskLevel.SAFE
        score < 70 -> RiskLevel.MEDIUM
        score < 85 -> RiskLevel.HIGH
        else -> RiskLevel.CRITICAL
    }
}
```

#### Task 2.3: Thai Text Analyzer with TFLite
```kotlin
// TextAnalyzer.kt
class TextAnalyzer @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var interpreter: Interpreter? = null
    private val thaiTokenizer = ThaiTokenizer()
    
    // Thai scam keywords (weighted)
    private val scamKeywords = mapOf(
        "โอนเงิน" to 0.8f,
        "ด่วน" to 0.6f,
        "OTP" to 0.9f,
        "บัญชี" to 0.5f,
        "ธนาคาร" to 0.4f,
        "รางวัล" to 0.7f,
        "ได้รับ" to 0.3f,
        "คลิก" to 0.6f,
        "ลิงก์" to 0.7f,
        "ยืนยัน" to 0.5f,
        "ตำรวจ" to 0.8f,
        "ศาล" to 0.8f,
        "หมายเรียก" to 0.9f,
        "ฟอกเงิน" to 0.9f,
        "พัสดุ" to 0.5f,
        "ค้างชำระ" to 0.6f
    )
    
    init {
        loadModel()
    }
    
    private fun loadModel() {
        try {
            val modelFile = context.assets.open("scam_detector.tflite")
            val modelBuffer = modelFile.readBytes().let {
                ByteBuffer.allocateDirect(it.size).apply {
                    order(ByteOrder.nativeOrder())
                    put(it)
                    rewind()
                }
            }
            interpreter = Interpreter(modelBuffer)
        } catch (e: Exception) {
            Log.e("TextAnalyzer", "Failed to load model", e)
        }
    }
    
    suspend fun analyze(message: String): Float = withContext(Dispatchers.Default) {
        // Keyword-based scoring (fallback/supplement to ML)
        val keywordScore = calculateKeywordScore(message)
        
        // ML model scoring
        val mlScore = runMLInference(message)
        
        // Combine scores
        (keywordScore * 0.4f + mlScore * 0.6f).coerceIn(0f, 100f)
    }
    
    private fun calculateKeywordScore(message: String): Float {
        var score = 0f
        val lowerMessage = message.lowercase()
        
        scamKeywords.forEach { (keyword, weight) ->
            if (lowerMessage.contains(keyword)) {
                score += weight * 20f
            }
        }
        
        // URL detection
        if (message.contains("http://") || message.contains("https://") || 
            message.contains(".com") || message.contains(".th")) {
            score += 15f
        }
        
        // Urgency patterns
        if (message.contains("ภายใน") || message.contains("วันนี้") || 
            message.contains("ทันที") || message.contains("ด่วนที่สุด")) {
            score += 20f
        }
        
        return score.coerceIn(0f, 100f)
    }
    
    private fun runMLInference(message: String): Float {
        interpreter?.let { model ->
            val tokens = thaiTokenizer.tokenize(message)
            val input = prepareInput(tokens)
            val output = Array(1) { FloatArray(1) }
            
            model.run(input, output)
            return output[0][0] * 100f
        }
        return 0f
    }
}
```

#### Task 2.4: Location & Geofencing Service
```kotlin
// GeofenceManager.kt
class GeofenceManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val fusedLocationClient: FusedLocationProviderClient
) {
    private val geofencingClient = LocationServices.getGeofencingClient(context)
    
    // ATM/Bank location types for Google Places
    private val financialPlaceTypes = listOf(
        "atm",
        "bank",
        "finance"
    )
    
    data class LocationContext(
        val isNearATM: Boolean,
        val isNearBank: Boolean,
        val distanceToNearestATM: Float?,
        val isUnusualLocation: Boolean,
        val isUnusualTime: Boolean
    )
    
    suspend fun getCurrentLocationContext(): LocationContext {
        val location = getCurrentLocation() ?: return LocationContext(
            isNearATM = false,
            isNearBank = false,
            distanceToNearestATM = null,
            isUnusualLocation = false,
            isUnusualTime = false
        )
        
        val nearbyATMs = findNearbyPlaces(location, "atm", 100f) // 100m radius
        val nearbyBanks = findNearbyPlaces(location, "bank", 100f)
        
        return LocationContext(
            isNearATM = nearbyATMs.isNotEmpty(),
            isNearBank = nearbyBanks.isNotEmpty(),
            distanceToNearestATM = nearbyATMs.minOfOrNull { it.distance },
            isUnusualLocation = checkUnusualLocation(location),
            isUnusualTime = checkUnusualTime()
        )
    }
    
    private fun checkUnusualTime(): Boolean {
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        // Unusual hours: 22:00 - 06:00
        return hour >= 22 || hour < 6
    }
    
    fun setupGeofencesForNearbyATMs(
        onEnterATMArea: (String) -> Unit
    ) {
        // Implementation for geofence monitoring
    }
}
```

#### Task 2.5: UI Components (Jetpack Compose)
```kotlin
// WarningScreen.kt
@Composable
fun WarningScreen(
    riskScore: Int,
    riskLevel: RiskLevel,
    signals: List<SignalType>,
    onDismiss: () -> Unit,
    onReportScam: () -> Unit,
    onAlertFamily: () -> Unit
) {
    val backgroundColor = when (riskLevel) {
        RiskLevel.MEDIUM -> Color(0xFFFFF3CD)
        RiskLevel.HIGH -> Color(0xFFFFCC80)
        RiskLevel.CRITICAL -> Color(0xFFEF9A9A)
        else -> Color.White
    }
    
    var countdown by remember { mutableStateOf(if (riskLevel >= RiskLevel.HIGH) 10 else 0) }
    
    LaunchedEffect(countdown) {
        if (countdown > 0) {
            delay(1000)
            countdown--
        }
    }
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = backgroundColor
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Warning Icon
            Icon(
                imageVector = when (riskLevel) {
                    RiskLevel.CRITICAL -> Icons.Filled.Error
                    RiskLevel.HIGH -> Icons.Filled.Warning
                    else -> Icons.Filled.Info
                },
                contentDescription = null,
                modifier = Modifier.size(80.dp),
                tint = when (riskLevel) {
                    RiskLevel.CRITICAL -> Color.Red
                    RiskLevel.HIGH -> Color(0xFFFF9800)
                    else -> Color(0xFFFFC107)
                }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Thai warning message
            Text(
                text = when (riskLevel) {
                    RiskLevel.CRITICAL -> "🚨 ตรวจพบความเสี่ยงสูงมาก!"
                    RiskLevel.HIGH -> "⚠️ ตรวจพบรูปแบบคล้าย Scam"
                    else -> "💡 โปรดระวัง"
                },
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Risk Score Indicator
            RiskScoreIndicator(
                score = riskScore,
                modifier = Modifier.size(120.dp)
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Detected signals
            SignalsList(signals = signals)
            
            Spacer(modifier = Modifier.height(32.dp))
            
            // Action buttons
            if (riskLevel >= RiskLevel.HIGH) {
                Button(
                    onClick = onAlertFamily,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.Red
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Filled.People, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("แจ้งคนในครอบครัว")
                }
                
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            OutlinedButton(
                onClick = onReportScam,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(Icons.Filled.Report, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("รายงานว่าเป็น Scam")
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            TextButton(
                onClick = onDismiss,
                enabled = countdown == 0
            ) {
                Text(
                    if (countdown > 0) "ดำเนินการต่อ ($countdown)" 
                    else "ฉันเข้าใจความเสี่ยง ดำเนินการต่อ"
                )
            }
        }
    }
}

@Composable
fun RiskScoreIndicator(
    score: Int,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            progress = score / 100f,
            modifier = Modifier.fillMaxSize(),
            strokeWidth = 12.dp,
            color = when {
                score < 50 -> Color.Green
                score < 70 -> Color.Yellow
                score < 85 -> Color(0xFFFF9800)
                else -> Color.Red
            }
        )
        
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "$score%",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "ความเสี่ยง",
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}
```

### Phase 3: Backend API

#### Task 3.1: FastAPI Setup
```python
# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.routes import reports, threats, model, health
from app.config import settings
from app.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown

app = FastAPI(
    title="CrowdShield API",
    description="Community-Driven Fraud Detection Platform API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(reports.router, prefix="/api/v1", tags=["Reports"])
app.include_router(threats.router, prefix="/api/v1", tags=["Threats"])
app.include_router(model.router, prefix="/api/v1", tags=["Model"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

#### Task 3.2: API Routes
```python
# reports.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import hashlib

router = APIRouter()

class ScamReportRequest(BaseModel):
    threat_signature: str  # SHA-256 hash of threat content
    threat_type: str       # call_scam, sms_scam, phishing
    risk_score: int        # 0-100
    location_cluster: Optional[str] = None  # Anonymized location
    device_attestation: Optional[str] = None  # Knox token

class ScamReportResponse(BaseModel):
    report_id: str
    community_impact: int  # Number of users protected
    timestamp: datetime

@router.post("/reports/submit", response_model=ScamReportResponse)
async def submit_report(report: ScamReportRequest):
    """
    Submit an anonymized scam report to the community intelligence database.
    
    Privacy guarantees:
    - No raw message content stored
    - Only threat signatures (hashes) are used
    - Location is clustered to 1km radius
    - Device attestation verifies legitimate reports
    """
    # Validate device attestation (Knox)
    if report.device_attestation:
        if not verify_knox_attestation(report.device_attestation):
            raise HTTPException(status_code=403, detail="Invalid device attestation")
    
    # Store report
    report_id = await store_report(report)
    
    # Calculate community impact
    impact = await calculate_community_impact(report.threat_signature)
    
    return ScamReportResponse(
        report_id=report_id,
        community_impact=impact,
        timestamp=datetime.utcnow()
    )

# threats.py
@router.get("/threats/check")
async def check_threat(phone_hash: str):
    """
    Check if a phone number hash exists in the threat database.
    
    Privacy: Only accepts SHA-256 hashed phone numbers.
    """
    threat = await get_threat_by_hash(phone_hash)
    
    if threat:
        return {
            "threat_level": threat.level,
            "reports_count": threat.reports_count,
            "first_reported": threat.first_reported,
            "last_reported": threat.last_reported
        }
    
    return {
        "threat_level": "unknown",
        "reports_count": 0
    }
```

#### Task 3.3: Federated Learning Server
```python
# federated_server.py
import flwr as fl
from flwr.server.strategy import FedAvg
from typing import List, Tuple, Optional, Dict
import numpy as np

class CrowdShieldStrategy(FedAvg):
    """
    Custom Federated Learning strategy with:
    - Differential Privacy (ε=0.2)
    - Byzantine fault tolerance
    - Trust-weighted aggregation
    """
    
    def __init__(
        self,
        epsilon: float = 0.2,
        delta: float = 1e-5,
        min_fit_clients: int = 100,
        min_evaluate_clients: int = 50,
        min_available_clients: int = 100,
    ):
        super().__init__(
            min_fit_clients=min_fit_clients,
            min_evaluate_clients=min_evaluate_clients,
            min_available_clients=min_available_clients,
        )
        self.epsilon = epsilon
        self.delta = delta
        self.client_trust_scores: Dict[str, float] = {}
    
    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[fl.server.client_proxy.ClientProxy, fl.common.FitRes]],
        failures: List[BaseException],
    ) -> Tuple[Optional[fl.common.Parameters], Dict[str, fl.common.Scalar]]:
        """
        Aggregate model updates with differential privacy noise.
        """
        if not results:
            return None, {}
        
        # Filter by trust scores (Byzantine tolerance)
        trusted_results = self._filter_by_trust(results)
        
        # Add differential privacy noise
        noisy_results = self._add_dp_noise(trusted_results)
        
        # Weighted aggregation
        return super().aggregate_fit(server_round, noisy_results, failures)
    
    def _add_dp_noise(self, results) -> List:
        """Add calibrated Gaussian noise for differential privacy."""
        sigma = np.sqrt(2 * np.log(1.25 / self.delta)) / self.epsilon
        
        noisy_results = []
        for client, fit_res in results:
            # Add noise to parameters
            noisy_params = []
            for param in fl.common.parameters_to_ndarrays(fit_res.parameters):
                noise = np.random.normal(0, sigma, param.shape)
                noisy_params.append(param + noise)
            
            noisy_fit_res = fl.common.FitRes(
                parameters=fl.common.ndarrays_to_parameters(noisy_params),
                num_examples=fit_res.num_examples,
                metrics=fit_res.metrics,
            )
            noisy_results.append((client, noisy_fit_res))
        
        return noisy_results

def start_fl_server(num_rounds: int = 10):
    """Start the Federated Learning server."""
    strategy = CrowdShieldStrategy(
        epsilon=0.2,
        min_fit_clients=100,
        min_available_clients=100,
    )
    
    fl.server.start_server(
        server_address="0.0.0.0:8080",
        config=fl.server.ServerConfig(num_rounds=num_rounds),
        strategy=strategy,
    )
```

### Phase 4: ML Models

#### Task 4.1: Thai Scam Text Classifier
```python
# thai_scam_classifier.py
import tensorflow as tf
from tensorflow import keras
from pythainlp import word_tokenize
import numpy as np

class ThaiScamClassifier:
    """
    Thai language scam message classifier using:
    - PyThaiNLP for tokenization
    - MobileNetV2-style efficient architecture
    - Optimized for TFLite conversion
    """
    
    def __init__(self, vocab_size: int = 10000, max_length: int = 128):
        self.vocab_size = vocab_size
        self.max_length = max_length
        self.model = self._build_model()
        self.tokenizer = None
    
    def _build_model(self) -> keras.Model:
        """Build lightweight model for mobile deployment."""
        inputs = keras.Input(shape=(self.max_length,), dtype=tf.int32)
        
        # Embedding layer
        x = keras.layers.Embedding(
            self.vocab_size, 
            64,  # Small embedding dim for efficiency
            input_length=self.max_length
        )(inputs)
        
        # Depthwise separable convolutions (MobileNet-style)
        x = keras.layers.SeparableConv1D(64, 3, activation='relu', padding='same')(x)
        x = keras.layers.GlobalAveragePooling1D()(x)
        
        # Dense layers
        x = keras.layers.Dense(32, activation='relu')(x)
        x = keras.layers.Dropout(0.3)(x)
        outputs = keras.layers.Dense(1, activation='sigmoid')(x)
        
        model = keras.Model(inputs, outputs)
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def tokenize_thai(self, text: str) -> list:
        """Tokenize Thai text using PyThaiNLP."""
        return word_tokenize(text, engine='newmm')
    
    def export_tflite(self, output_path: str):
        """Export model to TFLite format for mobile deployment."""
        converter = tf.lite.TFLiteConverter.from_keras_model(self.model)
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.float16]
        
        tflite_model = converter.convert()
        
        with open(output_path, 'wb') as f:
            f.write(tflite_model)
        
        print(f"Model exported to {output_path}")
        print(f"Model size: {len(tflite_model) / 1024 / 1024:.2f} MB")

# Sample training data structure
SAMPLE_SCAM_MESSAGES = [
    {"text": "คุณได้รับรางวัล 100,000 บาท กรุณาโอนค่าธรรมเนียม 500 บาท", "label": 1},
    {"text": "ธนาคารกสิกรไทยแจ้งเตือน บัญชีของท่านถูกระงับ กรุณาคลิกลิงก์", "label": 1},
    {"text": "สวัสดีครับ นัดเจอกันพรุ่งนี้เวลา 10 โมงนะครับ", "label": 0},
    {"text": "ใบเสร็จรับเงินจาก 7-Eleven ยอด 85 บาท", "label": 0},
]
```

### Phase 5: Documentation

#### Task 5.1: README.md
```markdown
# 🛡️ CrowdShield

[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](android/)
[![Kotlin](https://img.shields.io/badge/Kotlin-0095D5?style=for-the-badge&logo=kotlin&logoColor=white)](android/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](backend/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](ml/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **ป้องกันภัย ไม่สอดส่อง | เข้าใจ ไม่ควบคุม**  
> *Protect without Spying | Understand without Controlling*

Community-Driven Fraud Detection Platform for Thailand  
**Samsung × KBTG Digital Fraud Cybersecurity Hackathon 2026**

---

## 🎯 Problem

Thailand faces an unprecedented digital fraud crisis:
- **168 million** scam calls/SMS detected in 2024 (+112% YoY)
- **฿60 billion** annual losses (~$1.7B USD)
- **89%** of Thais encounter scams monthly
- **75.3%** of elderly (13M people) have been victimized

## 💡 Solution

CrowdShield transforms every smartphone into a fraud detection sensor using:

| Feature | Description |
|---------|-------------|
| 🤖 **On-Device ML** | TensorFlow Lite models analyze messages without sending data to cloud |
| 🔗 **Federated Learning** | Community intelligence improves detection while preserving privacy |
| 📍 **Multi-Signal Detection** | Correlates calls, location (ATM proximity), and messages |
| 👨‍👩‍👧‍👦 **Family Protection** | One-tap alerts to family members during high-risk situations |
| 🔒 **Privacy-First** | Differential privacy (ε=0.2), on-device processing, Knox attestation |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S DEVICE                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   Call   │  │   SMS    │  │ Location │                  │
│  │ Monitor  │  │ Analyzer │  │ Context  │                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       └─────────────┼─────────────┘                        │
│                     ▼                                       │
│         ┌─────────────────────┐                            │
│         │  On-Device ML (TFLite) │◄── Knox Attestation     │
│         └──────────┬──────────┘                            │
│                    ▼                                       │
│         ┌─────────────────────┐                            │
│         │   Risk Assessment   │──► Warning UI              │
│         └──────────┬──────────┘                            │
│                    │ (anonymized only)                     │
└────────────────────┼───────────────────────────────────────┘
                     │
        ═══════════════════════════ Privacy Boundary
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   CROWDSHIELD CLOUD                         │
│         ┌──────────────────────────────┐                   │
│         │  Federated Learning Server   │                   │
│         │  (Flower + Google Cloud)     │                   │
│         └──────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Android App
```bash
cd android
./gradlew assembleDebug
```

### Backend API
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### ML Training
```bash
cd ml
pip install -r requirements.txt
python src/training/trainer.py
```

## 📊 Key Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Detection Accuracy | >94% | 🎯 |
| False Positive Rate | <1% | 🎯 |
| Detection Latency | <100ms | 🎯 |
| Battery Impact | <2%/day | 🎯 |
| Privacy (ε) | ≤0.2 | 🎯 |

## 🤝 Partners

- **Samsung** - Knox Security, Smart Call integration
- **KBTG** - K PLUS 22M users, Deep Tech APIs
- **Google Cloud** - Vertex AI, Web Risk API
- **NCSA Thailand** - AOC 1441 integration

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Team CrowdShield** | Samsung × KBTG Hackathon 2026
```

---

## ⚙️ Execution Instructions

### Step 1: Start with Repository Setup
```
สร้าง repository structure ตาม Phase 1 ก่อน แล้ว commit initial structure
```

### Step 2: Android App Development
```
เริ่มจาก core detection engine → UI components → integration testing
Priority: ให้ demo ทำงานได้ก่อน แม้จะเป็น mock data
```

### Step 3: Backend API
```
สร้าง FastAPI endpoints พื้นฐาน → database models → FL server setup
```

### Step 4: ML Models
```
Train basic Thai scam classifier → export to TFLite → integrate with Android
```
