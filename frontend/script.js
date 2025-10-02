document.addEventListener("DOMContentLoaded", () => {
  // MongoDB helper function
  async function saveToMongoDB(data) {
    try {
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.log('MongoDB not available');
      return null;
    }
  }

  // ================== FONT RESIZE ==================
  let currentSize = 16;
  document.getElementById("increase-font")?.addEventListener("click", () => {
    currentSize += 2;
    document.body.style.fontSize = currentSize + "px";
  });
  document.getElementById("decrease-font")?.addEventListener("click", () => {
    currentSize -= 2;
    document.body.style.fontSize = currentSize + "px";
  });

// ================== LOGIN MODAL ==================
const loginBtn = document.getElementById("loginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toggleSignup = document.getElementById("toggleSignup");
const toggleLogin = document.getElementById("toggleLogin");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const authLoading = document.getElementById("authLoading");
const authMessage = document.getElementById("authMessage");

// Show/hide loading spinner
function showLoading(show) {
  if (authLoading) {
    authLoading.style.display = show ? 'block' : 'none';
  }
}

// Show message
function showMessage(message, type = 'error') {
  if (authMessage) {
    authMessage.textContent = message;
    authMessage.className = type === 'success' ? 'success-message' : 'error-message';
    authMessage.style.display = 'block';
    
    // Auto hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        authMessage.style.display = 'none';
      }, 3000);
    }
  }
}

// Reset forms
function resetForms() {
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();
  if (authMessage) authMessage.style.display = 'none';
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginOverlay.style.display = "flex";
    resetForms();
    // Show login form by default
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    toggleSignup.style.display = "inline";
    toggleLogin.style.display = "none";
    formTitle.textContent = "Portal Login";
    formSubtitle.textContent = "Access your medical records and health dashboard";
  });
}

if (closeLogin) {
  closeLogin.addEventListener("click", () => {
    loginOverlay.style.display = "none";
    resetForms();
  });
}

if (loginOverlay) {
  loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) {
      loginOverlay.style.display = "none";
      resetForms();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    showLoading(true);
    showMessage('', 'error'); // Clear previous messages

    try {
      const result = await loginUser({ email, password });
      
      if (result.success) {
        showMessage('Login successful! Redirecting...', 'success');
        
        // Log login activity
        await logUserActivity('LOGIN', `User ${email} logged in successfully`);
        
        setTimeout(() => {
          loginOverlay.style.display = "none";
          resetForms();
          // Update UI to show user is logged in
          updateUIForLoggedInUser();
        }, 1500);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Login failed. Please try again.', 'error');
    } finally {
      showLoading(false);
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long!', 'error');
      return;
    }

    showLoading(true);
    showMessage('', 'error'); // Clear previous messages

    try {
      const result = await registerUser({ name, email, password });
      
      if (result.success) {
        showMessage('Account created successfully! Welcome to Medilocker.', 'success');
        
        // Log registration activity
        await logUserActivity('REGISTRATION', `User ${name} registered with email ${email}`);
        
        setTimeout(() => {
          loginOverlay.style.display = "none";
          resetForms();
          // Update UI to show user is logged in
          updateUIForLoggedInUser();
        }, 2000);
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('Registration failed. Please try again.', 'error');
    } finally {
      showLoading(false);
    }
  });
}

if (toggleSignup) {
  toggleSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    toggleSignup.style.display = "none";
    toggleLogin.style.display = "inline";
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Join Medilocker to access healthcare services";
    resetForms();
  });
}

if (toggleLogin) {
  toggleLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    toggleLogin.style.display = "none";
    toggleSignup.style.display = "inline";
    formTitle.textContent = "Portal Login";
    formSubtitle.textContent = "Access your medical records and health dashboard";
    resetForms();
  });
}
  // ================== SLIDER ==================
  let slides = document.querySelectorAll(".slide");
  let index = 0;
  if (slides.length > 0) {
    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 4000);
  }

  // ================== FEATURES (card toggle) ==================
  const featureBtns = document.querySelectorAll(".feature-btn");
  featureBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = btn.parentElement;
      if (card.classList.contains("open")) {
        card.classList.remove("open");
        btn.classList.remove("active");
      } else {
        document.querySelectorAll(".feature-card").forEach(c => c.classList.remove("open"));
        document.querySelectorAll(".feature-btn").forEach(b => b.classList.remove("active"));
        card.classList.add("open");
        btn.classList.add("active");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".feature-card").forEach(c => c.classList.remove("open"));
    document.querySelectorAll(".feature-btn").forEach(b => b.classList.remove("active"));
  });

  // ================== STATE CARDS (All India states) ==================
  document.querySelectorAll(".state-card").forEach((card) => {
    card.addEventListener("click", function () {
      const stateName = this.querySelector(".state-name").textContent.trim();
      const stateSlug = getStateSlug(stateName);
      
      console.log("Clicked:", stateName, "Slug:", stateSlug);
      
      if (stateSlug === 'view-all') {
        openAllStates();
      } else {
        openStateHospitals(stateSlug);
      }
    });
  });
});

// ================== STATE HOSPITAL DATA ==================
const stateHospitalData = {
  'andhra-pradesh': {
    name: 'Andhra Pradesh',
    hospitals: [
      { name: 'Apollo Hospital', location: 'Visakhapatnam', specialties: ['Multi-specialty', 'Cardiology', 'Emergency'], phone: '+91-891-2547896' },
      { name: 'Care Hospital', location: 'Visakhapatnam', specialties: ['Cardiology', 'Neurology', 'ICU'], phone: '+91-891-2564897' },
      { name: 'KGH (King George Hospital)', location: 'Visakhapatnam', specialties: ['Government', 'Multi-specialty', 'Emergency'], phone: '+91-891-2564898' },
      { name: 'Medicover Hospital', location: 'Visakhapatnam', specialties: ['Multi-specialty', 'Surgery', 'Maternity'], phone: '+91-891-2789456' },
      { name: 'SevenHills Hospital', location: 'Visakhapatnam', specialties: ['Multi-specialty', 'Trauma', 'Emergency'], phone: '+91-891-2547897' }
    ]
  },
  'telangana': {
    name: 'Telangana & Hyderabad',
    hospitals: [
      { name: 'Yashoda Hospitals', location: 'Hyderabad', specialties: ['Multi-specialty', 'Transplant', 'Oncology'], phone: '+91-40-45674567' },
      { name: 'Apollo Hospital', location: 'Hyderabad', specialties: ['Multi-specialty', 'Cardiology', 'Emergency'], phone: '+91-40-43434567' },
      { name: 'KIMS Hospitals', location: 'Hyderabad', specialties: ['Multi-specialty', 'Neurology', 'Surgery'], phone: '+91-40-44885000' },
      { name: 'Continental Hospitals', location: 'Hyderabad', specialties: ['Multi-specialty', 'Research', 'ICU'], phone: '+91-40-67135100' }
    ]
  },
  'tamil-nadu': {
    name: 'Tamil Nadu',
    hospitals: [
      { name: 'Apollo Hospital', location: 'Chennai', specialties: ['Multi-specialty', 'Transplant', 'Research'], phone: '+91-44-28293333' },
      { name: 'MIOT Hospital', location: 'Chennai', specialties: ['Multi-specialty', 'Orthopedics', 'Surgery'], phone: '+91-44-42002288' },
      { name: 'Fortis Malar Hospital', location: 'Chennai', specialties: ['Cardiology', 'Multi-specialty', 'Emergency'], phone: '+91-44-42892222' }
    ]
  },
  'maharashtra': {
    name: 'Maharashtra & Mumbai',
    hospitals: [
      { name: 'KEM Hospital', location: 'Mumbai', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-22-24107000' },
      { name: 'Lilavati Hospital', location: 'Mumbai', specialties: ['Multi-specialty', 'Emergency', 'Surgery'], phone: '+91-22-26751000' },
      { name: 'Apollo Hospital', location: 'Mumbai', specialties: ['Multi-specialty', 'Transplant', 'Cardiology'], phone: '+91-22-62808666' },
      { name: 'Fortis Hospital', location: 'Mumbai', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-22-66254444' },
      { name: 'Ruby Hall Clinic', location: 'Pune', specialties: ['Multi-specialty', 'Research', 'Emergency'], phone: '+91-20-66455111' }
    ]
  },
  'delhi': {
    name: 'Delhi & NCR',
    hospitals: [
      { name: 'AIIMS Delhi', location: 'Delhi', specialties: ['Multi-specialty', 'Research', 'Government'], phone: '+91-11-26588500' },
      { name: 'Apollo Hospital', location: 'Delhi', specialties: ['Multi-specialty', 'Transplant', 'Emergency'], phone: '+91-11-29871090' },
      { name: 'Fortis Escorts', location: 'Delhi', specialties: ['Cardiology', 'Multi-specialty', 'Research'], phone: '+91-11-42776222' },
      { name: 'Max Super Specialty', location: 'Delhi', specialties: ['Multi-specialty', 'Surgery', 'ICU'], phone: '+91-11-26515050' }
    ]
  },
  'karnataka': {
    name: 'Karnataka & Bangalore',
    hospitals: [
      { name: 'Manipal Hospital', location: 'Bangalore', specialties: ['Multi-specialty', 'Research', 'Transplant'], phone: '+91-80-25024444' },
      { name: 'Narayana Health', location: 'Bangalore', specialties: ['Cardiology', 'Multi-specialty', 'Research'], phone: '+91-80-71222222' },
      { name: 'Fortis Hospital', location: 'Bangalore', specialties: ['Multi-specialty', 'Emergency', 'Surgery'], phone: '+91-80-66214444' }
    ]
  },
  'west-bengal': {
    name: 'West Bengal & Kolkata',
    hospitals: [
      { name: 'Apollo Gleneagles', location: 'Kolkata', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-33-23203040' },
      { name: 'AMRI Hospital', location: 'Kolkata', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-33-66800000' },
      { name: 'Fortis Hospital', location: 'Kolkata', specialties: ['Multi-specialty', 'Emergency', 'Research'], phone: '+91-33-66284444' }
    ]
  },
  'kerala': {
    name: 'Kerala',
    hospitals: [
      { name: 'Amrita Institute', location: 'Kochi', specialties: ['Multi-specialty', 'Research', 'Transplant'], phone: '+91-484-2851234' },
      { name: 'Lisie Hospital', location: 'Kochi', specialties: ['Multi-specialty', 'Cardiology', 'Emergency'], phone: '+91-484-2358001' },
      { name: 'KIMS Hospital', location: 'Trivandrum', specialties: ['Multi-specialty', 'Surgery', 'ICU'], phone: '+91-471-2447575' }
    ]
  },
  'gujarat': {
    name: 'Gujarat',
    hospitals: [
      { name: 'Apollo Hospital', location: 'Ahmedabad', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-79-66701800' },
      { name: 'Sterling Hospital', location: 'Ahmedabad', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-79-40097777' },
      { name: 'CIMS Hospital', location: 'Ahmedabad', specialties: ['Multi-specialty', 'Research', 'Emergency'], phone: '+91-79-66117777' }
    ]
  },
  'rajasthan': {
    name: 'Rajasthan',
    hospitals: [
      { name: 'Fortis Escorts', location: 'Jaipur', specialties: ['Cardiology', 'Multi-specialty', 'Emergency'], phone: '+91-141-2547000' },
      { name: 'Manipal Hospital', location: 'Jaipur', specialties: ['Multi-specialty', 'Surgery', 'ICU'], phone: '+91-141-5167777' },
      { name: 'Narayana Hospital', location: 'Jaipur', specialties: ['Multi-specialty', 'Cardiology', 'Research'], phone: '+91-141-7122222' }
    ]
  },
  'uttar-pradesh': {
    name: 'Uttar Pradesh',
    hospitals: [
      { name: 'Apollo Hospital', location: 'Lucknow', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-522-6787777' },
      { name: 'Fortis Hospital', location: 'Lucknow', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-522-6625555' },
      { name: 'SGPGI', location: 'Lucknow', specialties: ['Government', 'Research', 'Multi-specialty'], phone: '+91-522-2668700' }
    ]
  },
  'madhya-pradesh': {
    name: 'Madhya Pradesh',
    hospitals: [
      { name: 'Apollo Hospital', location: 'Indore', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-731-4225555' },
      { name: 'CHL Hospital', location: 'Indore', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-731-4225555' },
      { name: 'Bombay Hospital', location: 'Indore', specialties: ['Multi-specialty', 'Research', 'Emergency'], phone: '+91-731-2535555' }
    ]
  },
  'bihar': {
    name: 'Bihar',
    hospitals: [
      { name: 'AIIMS Patna', location: 'Patna', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-612-2451000' },
      { name: 'Ruban Memorial Hospital', location: 'Patna', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-612-2255000' },
      { name: 'Paras HMRI Hospital', location: 'Patna', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-612-2256000' }
    ]
  },
  'punjab': {
    name: 'Punjab',
    hospitals: [
      { name: 'Fortis Hospital', location: 'Mohali', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-172-4692222' },
      { name: 'Apollo Hospital', location: 'Ludhiana', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-161-6611000' },
      { name: 'Dayanand Medical College', location: 'Ludhiana', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-161-4688800' }
    ]
  },
  'haryana': {
    name: 'Haryana',
    hospitals: [
      { name: 'Medanta The Medicity', location: 'Gurgaon', specialties: ['Multi-specialty', 'Research', 'Transplant'], phone: '+91-124-4141414' },
      { name: 'Fortis Memorial Research', location: 'Gurgaon', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-124-4962200' },
      { name: 'Artemis Hospital', location: 'Gurgaon', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-124-4511111' }
    ]
  },
  'odisha': {
    name: 'Odisha',
    hospitals: [
      { name: 'AIIMS Bhubaneswar', location: 'Bhubaneswar', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-674-2476000' },
      { name: 'Apollo Hospital', location: 'Bhubaneswar', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-674-6666600' },
      { name: 'Kalinga Hospital', location: 'Bhubaneswar', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-674-2388000' }
    ]
  },
  'jharkhand': {
    name: 'Jharkhand',
    hospitals: [
      { name: 'RIMS Ranchi', location: 'Ranchi', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-651-2540000' },
      { name: 'Medanta Hospital', location: 'Ranchi', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-651-6601000' },
      { name: 'Appolo Hospital', location: 'Ranchi', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-651-3014444' }
    ]
  },
  'assam': {
    name: 'Assam',
    hospitals: [
      { name: 'GMCH Guwahati', location: 'Guwahati', specialties: ['Government', 'Multi-specialty', 'Research'], phone: '+91-361-2529000' },
      { name: 'Apollo Hospital', location: 'Guwahati', specialties: ['Multi-specialty', 'Emergency', 'ICU'], phone: '+91-361-7107107' },
      { name: 'Narayana Hospital', location: 'Guwahati', specialties: ['Multi-specialty', 'Cardiology', 'Surgery'], phone: '+91-361-7107100' }
    ]
  }
};

// ================== HELPER FUNCTIONS ==================
function getStateSlug(stateName) {
  if (stateName.toLowerCase().includes('view all')) return 'view-all';
  
  const slugMap = {
    'andhra pradesh': 'andhra-pradesh',
    'telangana & hyderabad': 'telangana',
    'tamil nadu': 'tamil-nadu',
    'maharashtra & mumbai': 'maharashtra',
    'delhi & ncr': 'delhi',
    'karnataka & bangalore': 'karnataka',
    'west bengal & kolkata': 'west-bengal',
    'kerala': 'kerala',
    'gujarat': 'gujarat',
    'rajasthan': 'rajasthan',
    'uttar pradesh': 'uttar-pradesh',
    'madhya pradesh': 'madhya-pradesh',
    'bihar': 'bihar',
    'punjab': 'punjab',
    'haryana': 'haryana',
    'odisha': 'odisha',
    'jharkhand': 'jharkhand',
    'assam': 'assam'
  };
  
  return slugMap[stateName.toLowerCase()] || stateName.toLowerCase().replace(/\s+/g, '-');
}

// ================== STATE HOSPITALS (All India) ==================
async function openStateHospitals(stateName) {
  const stateData = stateHospitalData[stateName];
  if (!stateData) {
    alert(`Hospital data for ${stateName.replace(/-/g, ' ')} is being updated. Please check back soon.`);
    return;
  }

  // Save hospital search to MongoDB
  try {
    await fetch('http://localhost:5001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Hospital Search',
        email: 'search@medilocker.com',
        message: `User viewed hospitals in ${stateData.name}`
      })
    });
  } catch (error) {
    console.log('MongoDB not connected');
  }

  const stateWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
  stateWindow.document.write(generateStateHTML(stateData));
  stateWindow.document.close();
}

// ================== ALL STATES VIEW ==================
function openAllStates() {
  const allStatesWindow = window.open('', '_blank', 'width=1400,height=900,scrollbars=yes');
  allStatesWindow.document.write(generateAllStatesHTML());
  allStatesWindow.document.close();
}

// ================== HTML GENERATORS ==================
function generateStateHTML(stateData) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hospitals in ${stateData.name}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background: #f5f7fa; color: #333; line-height: 1.6; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: white; text-decoration: none; margin-bottom: 15px; font-weight: 500; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; }
        .back-btn:hover { background: rgba(255,255,255,0.3); }
        .search-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 30px; }
        .search-input { width: 100%; padding: 15px 20px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1.1rem; }
        .search-input:focus { outline: none; border-color: #1a73e8; box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1); }
        .hospital-list { display: grid; gap: 20px; }
        .hospital-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); transition: all 0.3s ease; border-left: 5px solid #1a73e8; }
        .hospital-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
        .hospital-name { font-size: 1.5rem; font-weight: 700; color: #1a73e8; margin-bottom: 10px; }
        .hospital-location { color: #666; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 1.1rem; }
        .hospital-specialties { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .specialty-tag { background: #e8f0fe; color: #1a73e8; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 500; }
        .hospital-contact { display: flex; gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 2px solid #f0f0f0; flex-wrap: wrap; }
        .contact-btn { background: #1a73e8; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; text-decoration: none; font-size: 1rem; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s ease; }
        .contact-btn:hover { background: #0d47a1; transform: translateY(-2px); }
        .contact-btn.get-directions { background: #34a853; }
        .contact-btn.get-directions:hover { background: #2e8b47; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" onclick="window.close()" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to States
          </a>
          <h1>Hospitals in ${stateData.name}</h1>
          <p>${stateData.hospitals.length} healthcare facilities found</p>
        </div>

        <div class="search-box">
          <input type="text" class="search-input" placeholder="🔍 Search hospitals by name, location, or specialty..." onkeyup="filterHospitals()">
        </div>

        <div class="hospital-list" id="hospitalList">
          ${stateData.hospitals.map(hospital => `
            <div class="hospital-card">
              <h3 class="hospital-name">${hospital.name}</h3>
              <div class="hospital-location">
                <i class="fas fa-map-marker-alt"></i>
                ${hospital.location}
              </div>
              <div class="hospital-specialties">
                ${hospital.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
              </div>
              <div class="hospital-contact">
                <a href="tel:${hospital.phone}" class="contact-btn">
                  <i class="fas fa-phone"></i> ${hospital.phone}
                </a>
                <button class="contact-btn get-directions" onclick="alert('Directions feature coming soon!')">
                  <i class="fas fa-directions"></i> Get Directions
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <script>
        function filterHospitals() {
          const searchTerm = document.querySelector('.search-input').value.toLowerCase();
          const hospitalCards = document.querySelectorAll('.hospital-card');
          let visibleCount = 0;

          hospitalCards.forEach(card => {
            const name = card.querySelector('.hospital-name').textContent.toLowerCase();
            const location = card.querySelector('.hospital-location').textContent.toLowerCase();
            const specialties = card.querySelector('.hospital-specialties').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || location.includes(searchTerm) || specialties.includes(searchTerm)) {
              card.style.display = 'block';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });

          document.querySelector('.header p').textContent = visibleCount + ' healthcare facilities found';
        }
      </script>
    </body>
    </html>
  `;
}

function generateAllStatesHTML() {
  const allIndianStates = {
    'andhra-pradesh': { name: 'Andhra Pradesh', count: '55+' },
    'telangana': { name: 'Telangana & Hyderabad', count: '67+' },
    'tamil-nadu': { name: 'Tamil Nadu', count: '89+' },
    'maharashtra': { name: 'Maharashtra & Mumbai', count: '229+' },
    'delhi': { name: 'Delhi & NCR', count: '102+' },
    'karnataka': { name: 'Karnataka & Bangalore', count: '176+' },
    'west-bengal': { name: 'West Bengal & Kolkata', count: '65+' },
    'kerala': { name: 'Kerala', count: '71+' },
    'gujarat': { name: 'Gujarat', count: '99+' },
    'rajasthan': { name: 'Rajasthan', count: '54+' },
    'uttar-pradesh': { name: 'Uttar Pradesh', count: '78+' },
    'madhya-pradesh': { name: 'Madhya Pradesh', count: '45+' },
    'bihar': { name: 'Bihar', count: '44+' },
    'punjab': { name: 'Punjab', count: '38+' },
    'haryana': { name: 'Haryana', count: '42+' },
    'odisha': { name: 'Odisha', count: '36+' },
    'jharkhand': { name: 'Jharkhand', count: '28+' },
    'assam': { name: 'Assam', count: '32+' }
  };

  const states = Object.entries(allIndianStates);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>All Indian States - Hospital Explorer</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background: #f5f7fa; color: #333; line-height: 1.6; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; padding: 30px; border-radius: 16px; margin-bottom: 30px; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; color: white; text-decoration: none; margin-bottom: 15px; font-weight: 500; background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 8px; }
        .back-btn:hover { background: rgba(255,255,255,0.3); }
        .search-box { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 30px; }
        .search-input { width: 100%; padding: 15px 20px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1.1rem; }
        .search-input:focus { outline: none; border-color: #1a73e8; box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1); }
        .states-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .state-card { background: linear-gradient(135deg, #f8f9fa, #e8f0fe); border-radius: 12px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s ease; border: 2px solid transparent; }
        .state-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(26, 115, 232, 0.15); border-color: #1a73e8; background: linear-gradient(135deg, #e8f0fe, #d2e3fc); }
        .state-name { font-size: 1.4rem; font-weight: 700; color: #1a73e8; margin-bottom: 15px; }
        .hospital-count { font-size: 1.8rem; font-weight: 800; color: #0d47a1; }
        .hospital-count span { font-size: 1rem; color: #666; display: block; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" onclick="window.close()" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Main
          </a>
          <h1>All Indian States</h1>
          <p>Browse hospitals across ${states.length} states and union territories</p>
        </div>

        <div class="search-box">
          <input type="text" class="search-input" placeholder="🔍 Search states..." onkeyup="filterStates()">
        </div>

        <div class="states-grid" id="statesGrid">
          ${states.map(([key, state]) => `
            <div class="state-card" onclick="openState('${key}')">
              <div class="state-name">${state.name}</div>
              <div class="hospital-count">${state.count}<br><span>Hospitals</span></div>
            </div>
          `).join('')}
        </div>
      </div>

      <script>
        function filterStates() {
          const searchTerm = document.querySelector('.search-input').value.toLowerCase();
          const stateCards = document.querySelectorAll('.state-card');

          stateCards.forEach(card => {
            const stateName = card.querySelector('.state-name').textContent.toLowerCase();
            if (stateName.includes(searchTerm)) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }

        function openState(stateKey) {
          if (window.opener && window.opener.openStateHospitals) {
            window.opener.openStateHospitals(stateKey);
            window.close();
          } else {
            alert('Cannot open hospital list. Please go back to the main page and try again.');
          }
        }
      </script>
    </body>
    </html>
  `;
}

// Make functions globally available
window.openStateHospitals = openStateHospitals;
window.openAllStates = openAllStates;
window.getStateSlug = getStateSlug;