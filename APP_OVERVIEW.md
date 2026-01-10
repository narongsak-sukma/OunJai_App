# OunJai App - Project Overview & Design

## 🎯 Project Identity

**Name:** อุ่นใจ (OunJai) / CrowdShield  
**Tagline:** "ป้องกันภัย ไม่สอดส่อง | เข้าใจ ไม่ควบคุม"  
*(Protect without Spying | Understand without Controlling)*

**Purpose:** Community-Driven Fraud Detection Platform for Thailand  
**Context:** Samsung × KBTG Digital Fraud Cybersecurity Hackathon 2026

---

## 📊 Problem Statement

### The Digital Fraud Crisis in Thailand

| Metric | Impact |
|--------|--------|
| **Scam Calls/SMS (2024)** | 168 million detected (+112% YoY) |
| **Annual Losses** | ฿60+ billion (~$1.7B USD) |
| **Population Affected** | 89% of Thais encounter scams monthly |
| **Elderly Victims** | 75.3% of 13M elderly have been victimized |

### Critical Insight from Police

The most common scam pattern is **Coercion Scenario**:
- Scammer calls → Victim stands at ATM → Demands money transfer

**Detection Pattern:**
```
Unknown caller + ATM location + Transfer request = HIGH RISK
```

---

## 💡 Solution Architecture

### Core Concept
Transform every smartphone into a privacy-preserving fraud detection sensor using multi-signal analysis and community intelligence.

### Key Features

#### 1. **🤖 On-Device ML Processing**
- TensorFlow Lite models run locally on device
- No raw message data sent to cloud
- Instant fraud detection (<100ms)
- Minimal battery impact (<2%/day)

#### 2. **🔗 Federated Learning**
- Community learns together without sharing private data
- Differential privacy (ε=0.2)
- Model improves from collective intelligence
- Byzantine fault tolerance

#### 3. **📍 Multi-Signal Detection**
Three-part detection ensemble:

```
┌─────────────────────────────────────────┐
│         INPUT SIGNALS                   │
│  • Call metadata                        │
│  • Message text (Thai language)         │
│  • Location context (ATM proximity)     │
│  • User behavior patterns               │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Text    │ │Behavior │ │Context  │
│Analyzer │ │Analyzer │ │Scorer   │
│40% wt   │ │35% wt   │ │25% wt   │
└────┬────┘ └────┬────┘ └────┬────┘
     └───────────┼───────────┘
                 ▼
         Risk Score (0-100)
```

#### 4. **👨‍👩‍👧‍👦 Family Protection**
- One-tap emergency alerts to trusted contacts
- Automatic notifications for critical-level threats
- Helps protect vulnerable elderly users

#### 5. **🔒 Privacy-First Design**
- **Privacy Boundary:** Only anonymized data crosses device boundary
- **On-device processing:** Raw messages never leave phone
- **Hashed identifiers:** Phone numbers stored as SHA-256 hashes
- **Knox attestation:** Device verification prevents fake reports
- **Differential privacy:** ε=0.2 for federated learning

---

## 🏗️ Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    USER'S DEVICE                         │
├──────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │Call Monitor│  │SMS Analyzer│  │  Location  │         │
│  │ (Android)  │  │   (Thai)   │  │  Context   │         │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘         │
│        └────────────────┼────────────────┘               │
│                         ▼                                │
│           ┌─────────────────────────┐                    │
│           │ On-Device ML Engine     │                    │
│           │ (TensorFlow Lite)       │                    │
│           └───────────┬─────────────┘                    │
│                       ▼                                  │
│           ┌─────────────────────────┐                    │
│           │  Risk Assessment        │◄─ Knox Attestation │
│           │  Engine                 │                    │
│           └───────────┬─────────────┘                    │
│                       │                                  │
│        ┌──────────────┼──────────────┐                   │
│        ▼              ▼              ▼                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │Adaptive  │  │ Family   │  │Community │               │
│  │Warning UI│  │  Alert   │  │  Report  │               │
│  └──────────┘  └──────────┘  └─────┬────┘               │
│                                     │                    │
└─────────────────────────────────────┼────────────────────┘
                                      │
              ═══════════════════════════════════
                 Privacy Boundary (Anonymized)
              ═══════════════════════════════════
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────┐
│                  CROWDSHIELD CLOUD                       │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────┐           │
│  │ Federated        │    │ Threat           │           │
│  │ Learning Server  │◄──►│ Intelligence DB  │           │
│  │ (Flower + GCP)   │    │                  │           │
│  └────────┬─────────┘    └────────┬─────────┘           │
│           │                       │                      │
│           ▼                       ▼                      │
│  ┌──────────────────────────────────────┐               │
│  │    External Integrations             │               │
│  │  • Google Safe Browsing API          │               │
│  │  • NCSA/AOC 1441 Database           │               │
│  │  • Bank Mule Account Registry       │               │
│  └──────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Risk Level & Response System

| Level | Score | UI Behavior | System Action |
|-------|-------|-------------|---------------|
| **Safe** | 0-49% | No interruption | Log, monitor |
| **Medium** | 50-69% | Subtle banner warning | Increase monitoring |
| **High** | 70-84% | Full-screen warning + 10s delay | Prepare family alert |
| **Critical** | 85-100% | Emergency alert + family notification | Auto community report |

### Adaptive UI Warnings

**Critical Level (85-100%)**
```
🚨 ตรวจพบความเสี่ยงสูงมาก!
[Risk Score: 95%]

Detected Signals:
• Scam keyword patterns
• Near ATM location
• Unknown caller
• Urgency language

[แจ้งคนในครอบครัว] ← Red button
[รายงานว่าเป็น Scam]
[ดำเนินการต่อ (10)] ← Countdown
```

---

## 🧠 ML Detection Models

### Ensemble Architecture

**1. Text Classifier (MobileNetV2 - 4.2MB)**
- Thai language support with PyThaiNLP
- Scam keyword detection (weighted)
- URL/link pattern detection
- Urgency language patterns
- Weight: 40%

**Thai Scam Keywords:**
- โอนเงิน (Transfer), OTP, ธนาคาร (Bank)
- ตำรวจ (Police), ศาล (Court), หมายเรียก (Summons)
- รางวัล (Prize), ด่วน (Urgent), คลิก (Click)

**2. Behavioral Anomaly Detector (LSTM - 2.8MB)**
- Call duration patterns
- Frequency analysis
- Time-of-day anomalies
- User interaction patterns
- Weight: 35%

**3. Rule-based Context Scorer (0.5MB)**
- Geofence ATM proximity (100m radius)
- Bank location detection
- Unusual time detection (22:00-06:00)
- Location history patterns
- Weight: 25%

**Final Score = (Text × 0.4) + (Behavior × 0.35) + (Context × 0.25)**

---

## 📱 Technology Stack

### Android Application
- **Language:** Kotlin
- **UI Framework:** Jetpack Compose + Material3
- **ML Framework:** TensorFlow Lite
- **Location:** Google Play Services Location + Geofencing
- **DI:** Hilt/Dagger
- **Database:** Room
- **Network:** Retrofit + OkHttp
- **Security:** Samsung Knox integration

### Backend (FastAPI)
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL + Redis
- **ML Server:** Flower (Federated Learning)
- **Privacy:** Differential Privacy library
- **Cloud:** Google Cloud Platform
- **APIs:** Google Safe Browsing, NCSA AOC 1441

### Machine Learning
- **Training:** TensorFlow + Keras
- **Deployment:** TensorFlow Lite
- **Thai NLP:** PyThaiNLP
- **Federated Learning:** Flower framework

---

## 🔐 Privacy & Security Design

### Privacy Guarantees

1. **On-Device Processing**
   - All message analysis happens locally
   - Raw content never transmitted
   
2. **Data Minimization**
   - Only threat signatures (SHA-256 hashes) shared
   - Phone numbers hashed before storage
   - Location clustered to 1km radius

3. **Differential Privacy**
   - ε=0.2 (strong privacy guarantee)
   - Calibrated noise in federated learning
   - Byzantine fault tolerance

4. **Device Attestation**
   - Samsung Knox verification
   - Prevents fake/malicious reports
   - Trust-weighted aggregation

---

## 🎯 Key Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Detection Accuracy | >94% | 🎯 |
| False Positive Rate | <1% | 🎯 |
| Detection Latency | <100ms | 🎯 |
| Battery Impact | <2%/day | 🎯 |
| Privacy (ε) | ≤0.2 | 🎯 |
| Model Size | <8MB total | 🎯 |

---

## 🤝 Partners & Integration

### Hackathon Sponsors
- **Samsung** - Knox Security, Smart Call, Auto Blocker
- **KBTG** - K PLUS 22M users, Deep Tech APIs
- **Google Cloud** - Vertex AI, Web Risk API, reCAPTCHA
- **SAS** - Enterprise fraud analytics
- **NCSA Thailand** - AOC 1441, regulatory compliance

### API Integrations
- Google Safe Browsing API (phishing URL detection)
- NCSA/AOC 1441 Database (known scam numbers)
- Bank Mule Account Registry (fraudulent accounts)

---

## 📦 Project Repository Structure

```
crowdshield-2.0/
├── android/              # Android Application (Kotlin + Compose)
│   ├── detection/        # Core ML detection engine
│   ├── location/         # Geofencing & ATM detection
│   ├── call/             # Call monitoring service
│   ├── ui/               # Jetpack Compose UI
│   └── ml/               # TFLite model integration
│
├── backend/              # FastAPI Backend
│   ├── api/routes/       # REST API endpoints
│   ├── ml/               # Federated learning server
│   └── database/         # Models & schemas
│
├── ml/                   # ML Training & Models
│   ├── notebooks/        # Jupyter notebooks
│   ├── models/           # Exported TFLite models
│   └── src/              # Training scripts
│
├── docs/                 # Documentation
└── demo/                 # Demo materials & screenshots
```

---

## 🚀 Implementation Phases

### Phase 1: Project Setup & Documentation ✅
- Repository structure
- README with badges
- Architecture documentation

### Phase 2: Android Application 🚧
- Core detection engine
- Thai text analyzer
- Location/geofencing service
- UI components (Compose)
- Call monitoring

### Phase 3: Backend API 📋
- FastAPI endpoints
- Report submission
- Threat intelligence DB
- Federated learning server

### Phase 4: ML Models 🧠
- Thai scam classifier training
- Behavioral anomaly detector
- TFLite export & optimization

### Phase 5: Integration & Testing ⚙️
- End-to-end testing
- Demo scenario
- Presentation materials

---

## 🎬 Demo Scenario

**Coercion Scam Detection Flow:**

1. **Incoming Call** - Unknown number (masked as "ตำรวจ")
2. **Message Analysis** - "คุณมีหมายเรียก กรุณาโอนเงิน 5,000 บาท"
3. **Location Context** - User standing at ATM (detected via geofence)
4. **Risk Assessment** - Score: 95% (CRITICAL)
5. **Warning Display** - Full-screen alert with 10s countdown
6. **Family Alert** - Auto-notify trusted contacts
7. **Community Report** - Anonymized threat signature shared

---

## 📄 License

MIT License - Open source for community benefit

---

**Created for:** Samsung × KBTG Digital Fraud Cybersecurity Hackathon 2026  
**Theme:** AI-Powered Fraud Detection & Prevention  
**Team:** CrowdShield
