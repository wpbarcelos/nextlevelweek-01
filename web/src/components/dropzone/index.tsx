import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./style.css";

interface Props {
  onFileUploaded: (File: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);
      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
