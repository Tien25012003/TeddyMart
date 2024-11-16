export const convertImageToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  const fileReader = new FileReader();
  return new Promise((resolve) => {
    fileReader.onloadend = () => {
      resolve(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  });
};
