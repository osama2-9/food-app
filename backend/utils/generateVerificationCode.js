const generateVerificationCode = () => {
    const code = Math.floor(Math.random() * 9000) + 1000; 
    return code;
};

export default generateVerificationCode;
