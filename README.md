# 📖 English to Ilocano Dictionary (PWA)

A modern, responsive **English to Ilocano Dictionary Web App** with offline support, favorites, and a clean UI inspired by modern learning apps.

---

## 🚀 Features

* 🔍 **Search Functionality**
  Quickly find words with a simple search button.

* 📄 **Word Cards + Modal View**
  Click a word to see its definition and usage.

* ❤️ **Favorites System**
  Save and manage your favorite words using local storage.

* 📅 **Word of the Day**
  Displays a random word daily (cached per day).

* 📚 **Pagination**
  Smooth browsing with previous/next navigation.

* 📱 **Progressive Web App (PWA)**

  * Installable on mobile/desktop
  * Works offline (via Service Worker)

* 🎨 **Modern UI Design**
  Glassmorphism + gradient theme + animated modal

---

## 🛠️ Tech Stack

* HTML5
* CSS3 (Custom UI + animations)
* JavaScript (Vanilla)
* Bootstrap 5
* LocalStorage API
* Service Workers

---

## 📂 Project Structure

```
project-folder/
│
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
├── ilocano_dictionary.json
│
├── images/
│   ├── favicon.ico
│   ├── android-chrome-192x192.png
│   └── android-chrome-512x512.png
```

---

## ⚙️ Installation & Setup

1. Clone or download the project

```
git clone https://github.com/your-username/e2i-dictionary.git
```

2. Open the project

* Open `index.html` in your browser
* OR use Live Server (recommended)

3. Make sure these files exist:

* `ilocano_dictionary.json`
* `service-worker.js`

---

## 📦 PWA Setup Notes

* Uses:

  * `manifest.json` for installability
  * `service-worker.js` for offline caching

* To test:

  * Open Chrome DevTools → Application tab
  * Enable Offline mode

---

## 🧠 How It Works

### 📌 Data Loading

```js
fetch('ilocano_dictionary.json')
```

### 📌 Word of the Day

* Stored in `localStorage`
* Updates once per day

### 📌 Favorites

```js
localStorage.setItem("favorites", JSON.stringify(favorites));
```

### 📌 Pagination

* 10 words per page
* Controlled via `currentPage`

---

## ✨ Future Improvements

* 🔊 Audio pronunciation
* 🌐 API-based dictionary
* 📊 Learning progress tracking
* 🎯 Quiz mode
* 🌙 Dark mode
* 📱 Mobile app (Capacitor / React Native)

---

## 🧑‍💻 Author

**Ermon Kyle Antonio**

---

## 📄 License

This project is open-source and free to use for educational purposes.
