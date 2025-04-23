import { AnimatePresence, motion } from "framer-motion";

export default function MessageBox({ message, type, isVisible }) {
  // type: "success" | "error"
  const styles = {
    success: {
      background: "#d1fae5", // green-100
      color: "#065f46", // green-900
    },
    error: {
      background: "#fee2e2", // red-100
      color: "#991b1b", // red-900
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="msg-box"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{
            ...styles[type],
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            margin: "1rem 0",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
