// Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

        import { firebaseConfig } from "./env.js";

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Function to fetch and display stats
        async function getStats() {
            try {
                // Corrected the collection name for papers to match your rules
                const usersCol = collection(db, "users");
                const questionsCol = collection(db, "questions");
                const papersCol = collection(db, "papers"); // FIX: Was "researchPapers"

                const userSnapshot = await getDocs(usersCol);
                const questionSnapshot = await getDocs(questionsCol);
                const paperSnapshot = await getDocs(papersCol);

                document.getElementById('active-members').innerText = userSnapshot.size.toLocaleString() + '+';
                document.getElementById('questions-answered').innerText = questionSnapshot.size.toLocaleString() + '+';
                document.getElementById('research-papers').innerText = paperSnapshot.size.toLocaleString() + '+';

            } catch (error) {
                console.error("Error fetching stats from Firebase: ", error);
                // Display fallback text if there's an error
                document.getElementById('active-members').innerText = '10,000+';
                document.getElementById('questions-answered').innerText = '50,000+';
                document.getElementById('research-papers').innerText = '1,000+';
            }
        }

        // Fetch stats when the page loads
        document.addEventListener('DOMContentLoaded', getStats);