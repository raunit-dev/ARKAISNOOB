import React from "react";

const VerifyCertificate = () => {
  // URL for the Blockscout explorer pointing to the contract address
  const explorerUrl =
    "https://edu-chain-testnet.blockscout.com/address/0x3fcC09B2D1023b031FB45317c170C0AB6eFDdaC0";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-lg border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-violet-600 mb-6">
          Verify Certificate
        </h1>

        <p className="text-gray-700 mb-4">
          To verify the authenticity of your certificate, please visit the
          blockchain explorer below. You can check the contract details, token
          ownership, and other transaction information there.
        </p>

        {/* Button to Open Blockscout Explorer */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-all text-center block"
        >
          Open Blockchain Explorer
        </a>
      </div>
    </div>
  );
};

export default VerifyCertificate;