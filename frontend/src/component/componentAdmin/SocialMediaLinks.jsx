// import React, { useState, useEffect } from "react";
// import {
//   FaFacebook,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedin,
//   FaFacebookMessenger,
//   FaWhatsapp,
//   FaTelegram,
//   FaYoutube,
//   FaTiktok,
//   FaPinterest,
//   FaViber,
// } from "react-icons/fa";
// import useAuthAdminStore from "../../store/AuthAdminStore.js";
//
// const SocialMediaLinks = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const { token } = useAuthAdminStore();
//
//   const [links, setLinks] = useState({
//     facebook: "",
//     twitter: "",
//     instagram: "",
//     linkedin: "",
//     messenger: "",
//     whatsapp: "",
//     telegram: "",
//     youtube: "",
//     tiktok: "",
//     pinterest: "",
//     viber: "",
//   });
//
//   const [message, setMessage] = useState(""); // For success or error messages
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/socialmedia`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();
//         // Extract only the social media links, excluding any other fields like _id
//         const { _id, ...socialLinks } = data.data;
//         setLinks(socialLinks);
//       } catch (error) {
//         alert(error.message);
//       }
//     };
//
//     fetchData();
//   }, [apiUrl]);
//
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLinks((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     for (let key in links) {
//       if (!links[key].trim()) {
//         alert(`${key} link is required.`);
//         return;
//       }
//     }
//
//     try {
//       const response = await fetch(`${apiUrl}/socialmedia`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(links),
//       });
//
//       if (!response.ok) {
//         throw new Error("Failed to update data");
//       }
//
//       const result = await response.json();
//       // Again extract only the social media links from the result
//       const { _id, ...updatedSocialLinks } = result.data;
//       setLinks(updatedSocialLinks);
//       setMessage(result.message); // Set success message
//
//       // Make the message disappear after 3 seconds
//       setTimeout(() => {
//         setMessage(""); // Clear the message after 3 seconds
//       }, 3000);
//     } catch (error) {
//       setMessage(error.message); // Set error message
//
//       // Make the message disappear after 3 seconds
//       setTimeout(() => {
//         setMessage(""); // Clear the message after 3 seconds
//       }, 3000);
//     }
//   };
//
//   return (
//     <div className="p-4 shadow rounded-lg">
//       <h1 className={"mb-6 text-xl font-semibold"}>Update Social Media Links</h1>
//
//       {/* Display message */}
//       {message && (
//         <div
//           className={`p-2 mb-4 text-center rounded-md ${
//             message.includes("successfully")
//               ? "primaryBgColor accentTextColor"
//               : "bg-red-500 text-white"
//           }`}
//         >
//           {message}
//         </div>
//       )}
//
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-2 gap-6 items-center">
//           {Object.entries(links).map(([key, value]) => (
//             <div key={key} className="space-x-2">
//               {key === "facebook" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaFacebook className="text-blue-600" />
//                   <span>Facebook Page Link:</span>
//                 </div>
//               )}
//               {key === "twitter" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaTwitter className="text-blue-400" />
//                   <span>Twitter Page Link:</span>
//                 </div>
//               )}
//               {key === "instagram" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaInstagram className="text-pink-500" />
//                   <span>Instagram Page Link:</span>
//                 </div>
//               )}
//               {key === "linkedin" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaLinkedin className="text-blue-700" />
//                   <span>Linkedin Page Link:</span>
//                 </div>
//               )}
//               {key === "messenger" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaFacebookMessenger className="text-blue-500" />
//                   <span>Messenger Page Link:</span>
//                 </div>
//               )}
//               {key === "whatsapp" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaWhatsapp className="text-green-500" />
//                   <span>Whatsapp Link:</span>
//                 </div>
//               )}
//               {key === "telegram" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaTelegram className="text-blue-400" />
//                   <span>Telegram Link:</span>
//                 </div>
//               )}
//               {key === "youtube" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaYoutube className="text-red-600" />
//                   <span>YouTube Channel Link:</span>
//                 </div>
//               )}
//               {key === "tiktok" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaTiktok className="text-black" />
//                   <span>Tiktok Page Link:</span>
//                 </div>
//               )}
//               {key === "pinterest" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaPinterest className="text-red-600" />
//                   <span>Pinterest Page Link:</span>
//                 </div>
//               )}
//               {key === "viber" && (
//                 <div className="flex items-center gap-2 pb-2">
//                   <FaViber className="text-purple-600" />
//                   <span>Viber Link:</span>
//                 </div>
//               )}
//               <input
//                 type="text"
//                 name={key}
//                 value={value}
//                 onChange={handleChange}
//                 placeholder={`Enter ${key} link`}
//                 className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-primaryColor bg-gray-100 rounded-md"
//               />
//             </div>
//           ))}
//         </div>
//         <div className={"flex justify-center"}>
//           <button
//             type="submit"
//             className="px-4 py-2 primaryBgColor accentTextColor rounded w-full"
//           >
//             Update Info
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
//
// export default SocialMediaLinks;
import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaViber,
} from "react-icons/fa";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Snackbar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SocialMediaLinks = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const [links, setLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    messenger: "",
    whatsapp: "",
    telegram: "",
    youtube: "",
    tiktok: "",
    pinterest: "",
    viber: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/socialmedia`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const { _id, ...socialLinks } = data.data;
        setLinks(socialLinks);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: "error" });
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/socialmedia`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(links),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      const result = await response.json();
      setLinks(result.data);
      setSnackbar({ open: true, message: result.message, severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const socialPlatforms = [
    { key: "facebook", icon: <FaFacebook color="#1877F2" />, label: "Facebook" },
    { key: "twitter", icon: <FaTwitter color="#1DA1F2" />, label: "Twitter" },
    { key: "instagram", icon: <FaInstagram color="#E1306C" />, label: "Instagram" },
    { key: "linkedin", icon: <FaLinkedin color="#0077B5" />, label: "LinkedIn" },
    { key: "messenger", icon: <FaFacebookMessenger color="#00B2FF" />, label: "Messenger" },
    { key: "whatsapp", icon: <FaWhatsapp color="#25D366" />, label: "WhatsApp" },
    { key: "telegram", icon: <FaTelegram color="#0088CC" />, label: "Telegram" },
    { key: "youtube", icon: <FaYoutube color="#FF0000" />, label: "YouTube" },
    { key: "tiktok", icon: <FaTiktok color="#000000" />, label: "TikTok" },
    { key: "pinterest", icon: <FaPinterest color="#E60023" />, label: "Pinterest" },
    { key: "viber", icon: <FaViber color="#7360F2" />, label: "Viber" },
  ];

  return (
    <Paper elevation={3} sx={{ padding: 3, position: "relative" }}>
      <Typography variant="h5" gutterBottom className={"pb-6"}>
        Update Social Media Links
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {socialPlatforms.map(({ key, icon, label }) => (
            <Grid item xs={12} sm={6} key={key} display="flex" alignItems="center" gap={2}>
              {icon}
              <TextField
                fullWidth
                label={label}
                name={key}
                value={links[key]}
                onChange={handleChange}
                placeholder={`Enter ${label} link`}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          Update Info
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Paper>
  );
};

export default SocialMediaLinks;

