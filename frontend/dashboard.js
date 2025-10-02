// Save as dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = localStorage.getItem('medilockerUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  
  // Display user greeting
  const userData = JSON.parse(user);
  document.getElementById('userGreeting').textContent = `Welcome, ${userData.username}`;
  
  // Load dashboard data
  loadDashboardData();
  
  // Logout functionality
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('medilockerUser');
    window.location.href = 'index.html';
  });
});

function loadDashboardData() {
  // In a real app, this would fetch data from an API
  // For now, we'll use localStorage to simulate data
  
  const documents = JSON.parse(localStorage.getItem('medilockerDocuments')) || [];
  
  // Update stats
  document.getElementById('totalRecords').textContent = documents.length;
  
  const recentCount = documents.filter(doc => {
    const docDate = new Date(doc.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return docDate > thirtyDaysAgo;
  }).length;
  
  document.getElementById('recentUploads').textContent = recentCount;
  
  // Calculate storage (simplified - 1 document = 1MB)
  document.getElementById('storageUsed').textContent = `${documents.length} MB`;
  
  // Display recent documents
  displayRecentDocuments(documents);
}

function displayRecentDocuments(documents) {
  const container = document.getElementById('recentDocuments');
  container.innerHTML = '';
  
  // Sort by date, newest first
  const sortedDocs = documents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Show only the 6 most recent
  const recentDocs = sortedDocs.slice(0, 6);
  
  if (recentDocs.length === 0) {
    container.innerHTML = '<p>No documents uploaded yet.</p>';
    return;
  }
  
  recentDocs.forEach(doc => {
    const docCard = document.createElement('div');
    docCard.className = 'document-card';
    
    // Get appropriate icon based on document type
    const icon = getDocumentIcon(doc.type);
    
    docCard.innerHTML = `
      <div class="document-icon">${icon}</div>
      <div class="document-name">${doc.name}</div>
      <div class="document-date">${formatDate(doc.date)}</div>
      <div class="document-type">${doc.type}</div>
    `;
    
    container.appendChild(docCard);
  });
}

function getDocumentIcon(type) {
  const icons = {
    'lab': '🧪',
    'scan': '🩻',
    'prescription': '💊',
    'appointment': '📅',
    'hospital': '🏥',
    'vaccination': '💉',
    'certificate': '📑',
    'other': '📄'
  };
  
  return icons[type] || '📄';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}