import { useState, useEffect } from "react";
// eslint-disable-next-line react/prop-types
const CodeArea = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  }, [copied]);

  return (
    <div className="bg-green-900 dark:bg-gray-900  rounded-b-lg relative">
      <pre className="text-white">
        <code>{code}</code>
      </pre>
      <button
        className="absolute top-2 right-2 bg-green-500 dark:bg-gray-500 hover:bg-green-400 hover:dark:bg-gray-400 duration-300 transition-all ease-in-out text-white font-bold py-1 px-3 rounded"
        onClick={copyToClipboard}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default CodeArea;
