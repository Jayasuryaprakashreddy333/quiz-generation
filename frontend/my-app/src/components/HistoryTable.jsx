

const HistoryTable = ({ details, onDetails }) => {
    console.log("HistoryTable details:", details);    
    const handleDetails = (quizId) => {
        onDetails(quizId);
    };
  return (<>
            <tr key={details.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{details.id}</td>
              <td className="px-4 py-2 border">{details.url}</td>
              <td className="px-4 py-2 border">{details.title}</td>
              <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDetails(details.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Details
                  </button>
                </td>
              </tr>
            </>);
};

export default HistoryTable;