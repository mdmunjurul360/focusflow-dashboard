import React, { useState } from "react";

const Feedback: React.FC = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5002/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          image,
        }),
      });

      const data = await res.text();
      console.log(data);

      alert("Feedback submitted ✅");

      // clear form
      setMessage("");
      setImage("");
    } catch (error) {
      console.error(error);
      alert("Error sending feedback ❌");
    }
  };

  return (
    <section className="feedback">
      <h2>Send Feedback</h2>

      <textarea
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </section>
  );
};

export default Feedback;