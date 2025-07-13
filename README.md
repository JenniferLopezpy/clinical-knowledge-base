# Clinical Knowledge Base

A comprehensive web application for managing Quality Care Measures (QCM) in medical call centers. This tool helps healthcare professionals track, manage, and access important clinical information efficiently.

## 🏥 Features

- **QCM Measures Management**: Access quality measures for different insurance providers (Healthfirst, FidelisCare, UnitedHealthcare, Molina)
- **Call Scripts**: Pre-written scripts in English and Spanish for patient communication
- **Call Tracking**: Monitor call outcomes and statistics by insurer
- **eCW Integration**: Step-by-step guides for electronic clinical workflow
- **Measure Images**: Visual references for different clinical measures
- **Updates & Reminders**: Important notifications and deadlines for the team

## 🚀 Live Demo

Visit the live application: https://jenniferlopezpy.github.io/clinical-knowledge-base

## 📁 Project Structure

```
SPH_KnowlesgeBase_QCM/
├── index.html                 # Main application file
├── css/                       # Stylesheets
│   ├── styles.css
│   ├── sidebar.css
│   └── components.css
├── js/                        # JavaScript files
│   ├── app.js                 # Main application logic
│   ├── data.js                # Sample data
│   ├── json-loader.js         # JSON data loader
│   ├── components.js          # UI components
│   ├── image-list.js          # Image management
│   └── excel-parser.js        # Excel file parser
├── Common/                    # Data and assets
│   ├── Docs/
│   │   ├── QCM Measures/      # Insurance provider JSON files
│   │   ├── Scripts/           # Call scripts JSON
│   │   └── Updates/           # Updates and reminders JSON
│   └── Img/                   # Measure reference images
└── README.md                  # This file
```

## 🛠️ Technologies Used

- **HTML5**: Structure and semantics
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Dynamic functionality
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Montserrat, Roboto)

## 📊 Data Management

The application uses JSON files for data storage:

- **QCM Measures**: Stored in `Common/Docs/QCM Measures/` with separate files for each insurance provider
- **Scripts**: Stored in `Common/Docs/Scripts/scripts.json`
- **Updates**: Stored in `Common/Docs/Updates/Updates.json`

## 🎯 How to Use

1. **QCM Measures**: Click on any insurance provider to view their specific quality measures
2. **Scripts**: Access pre-written call scripts in both English and Spanish
3. **Call Tracker**: Monitor call statistics and outcomes
4. **eCW Steps**: Follow the 6-step process for adding measures to patient To-Do lists
5. **Measure Images**: View visual references for different clinical measures
6. **Updates**: Check important reminders and team notifications

## 🔧 Local Development

To run this project locally:

1. Clone the repository
2. Navigate to the project directory
3. Start a local server:
   ```bash
   python -m http.server 8000
   ```
4. Open `http://localhost:8000` in your browser

## 📝 Adding Content

### Adding New QCM Measures
Edit the JSON files in `Common/Docs/QCM Measures/` for each insurance provider.

### Adding New Scripts
Edit `Common/Docs/Scripts/scripts.json` to add new call scripts.

### Adding Updates
Edit `Common/Docs/Updates/Updates.json` to add new reminders and notifications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Support

For questions or support, please contact the development team or create an issue in this repository.

---

**Developed for Medical Call Center Operations** 🏥 