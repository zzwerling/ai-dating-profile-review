import BioForm from "../components/BioForm";
import ConvoCoachForm from "../components/ConvoCoachForm";
import NavBar from "../components/NavBar";

function ConvoCoachPage() {


    return (
        <div className="min-h-screen bg-gray-100">
      <NavBar />
        <div className="min-h-screen bg-gray-100 px-4 py-8">
          <div className="w-full flex justify-start mb-4 px-4">
         
          </div>
    
          <div className="w-full flex justify-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
              AI-Powered Dating Conversation Coach
            </h2>
          </div>
    
          <div className="flex items-center justify-center">
            <ConvoCoachForm />
          </div>
        </div>
        </div>
      );
}

export default ConvoCoachPage;