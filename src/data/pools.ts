

export const FIRST_NAMES_MALE = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Krishna", "Ishaan",
  "Rohan", "Karthik", "Siddharth", "Aniket", "Dhruv", "Kabir", "Manish", "Rahul",
  "Nikhil", "Varun", "Aman", "Yash", "Harsh", "Tarun", "Gaurav", "Sahil",
  "Akash", "Pranav", "Raghav", "Devansh", "Shaurya", "Aryan", "Naveen", "Pratik",
] as const;

export const FIRST_NAMES_FEMALE = [
  "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Anika", "Navya", "Ira",
  "Riya", "Meera", "Sneha", "Pooja", "Nisha", "Tanvi", "Kavya", "Shreya",
  "Aishwarya", "Divya", "Neha", "Priya", "Sakshi", "Isha", "Ritika", "Aditi",
  "Swara", "Mahima", "Lavanya", "Trisha", "Bhavya", "Charvi", "Ishita", "Manya",
] as const;

export const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Iyer", "Nair", "Menon", "Reddy", "Rao",
  "Patel", "Shah", "Mehta", "Joshi", "Desai", "Kulkarni", "Deshpande", "Kapoor",
  "Khanna", "Malhotra", "Chopra", "Bhatia", "Singh", "Chauhan", "Pillai", "Naidu",
  "Banerjee", "Chatterjee", "Mukherjee", "Bose", "Das", "Sinha", "Agarwal", "Jain",
] as const;

export const CITIES: { city: string; country: string }[] = [
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Bengaluru", country: "India" },
  { city: "Hyderabad", country: "India" },
  { city: "Chennai", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Kolkata", country: "India" },
  { city: "Ahmedabad", country: "India" },
  { city: "Jaipur", country: "India" },
  { city: "Chandigarh", country: "India" },
  { city: "Gurugram", country: "India" },
  { city: "Noida", country: "India" },
  { city: "Kochi", country: "India" },
  { city: "Indore", country: "India" },
  { city: "San Francisco", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Singapore", country: "Singapore" },
  { city: "Dubai", country: "UAE" },
];

export const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "BITS Pilani",
  "NIT Trichy", "Delhi University", "VIT Vellore", "Manipal Institute of Technology",
  "SRCC", "St. Stephen's College", "Christ University", "Symbiosis", "NMIMS",
  "Anna University", "Jadavpur University", "IIM Ahmedabad", "ISB Hyderabad",
  "AIIMS Delhi", "NLU Bangalore",
] as const;

export const DEGREES = [
  "B.Tech Computer Science", "B.Tech Electronics", "B.E. Mechanical",
  "MBBS", "B.Com (Hons)", "BBA", "B.Sc Economics", "B.Arch",
  "BA Psychology", "LLB", "CA", "B.Des", "M.Tech", "MBA", "B.Sc Statistics",
] as const;

export const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Flipkart", "Razorpay", "Zomato", "Swiggy",
  "TCS", "Infosys", "Wipro", "Deloitte", "McKinsey & Company", "Goldman Sachs",
  "Stripe", "Atlassian", "Adobe", "Apollo Hospitals", "Cult.fit", "CRED",
  "PhonePe", "Self-employed", "Tata Group", "Reliance", "Unacademy",
] as const;

export const DESIGNATIONS = [
  "Software Engineer", "Senior Software Engineer", "Product Manager",
  "Data Scientist", "Consultant", "Investment Banker", "Doctor", "Architect",
  "Marketing Manager", "UX Designer", "Founder", "Chartered Accountant",
  "Research Analyst", "Operations Lead", "Lawyer", "Professor",
] as const;

export const RELIGIONS = [
  "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi",
] as const;

export const CASTES_BY_RELIGION: Record<string, string[]> = {
  Hindu: ["Brahmin", "Kshatriya", "Agarwal", "Maratha", "Reddy", "Nair", "Iyer", "Kayastha", "Rajput", "Khatri"],
  Muslim: ["Sunni", "Shia", "Khoja", "Memon"],
  Christian: ["Roman Catholic", "Protestant", "Syrian Christian"],
  Sikh: ["Jat", "Khatri", "Ramgarhia"],
  Jain: ["Digambar", "Shwetambar"],
  Buddhist: ["Navayana", "Theravada"],
  Parsi: ["Zoroastrian"],
};

export const MOTHER_TONGUES = [
  "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati", "Kannada",
  "Malayalam", "Punjabi", "Urdu", "Odia", "Konkani",
] as const;

export const LANGUAGES = [
  "English", "Hindi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati",
  "Kannada", "Malayalam", "Punjabi", "French", "Spanish",
] as const;

export const ABOUT_OPENERS = [
  "Easy-going and curious",
  "Ambitious but grounded",
  "A foodie at heart",
  "Equal parts introvert and adventurer",
  "Family-oriented and independent",
  "Always up for a good conversation",
  "Driven by purpose",
  "A weekend trekker",
] as const;

export const ABOUT_HOBBIES = [
  "loves long drives and indie music",
  "into fitness, books, and travel",
  "spends weekends cooking and painting",
  "passionate about startups and chai",
  "enjoys photography and hiking",
  "a cricket fan and amateur chef",
  "into yoga, journaling, and dogs",
  "loves theatre and trying new cafes",
] as const;
