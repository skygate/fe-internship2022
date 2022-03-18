import { getBaseERC721ContractComponents } from "../../../helpers.jsx";

const TokenCount = (props) => {
    const getTokenCount = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .count()
                .then((result) => {
                    console.log(`>>> Token count: ${parseInt(result._hex)}`);
                })
                .catch((error) => {
                    // console.log(error.message);
                    console.log(error.data.message);
                });
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <div className="center">
            <div>
                <h2>Get token count</h2>
                <button onClick={getTokenCount} type="submit">
                    Get token count
                </button>
            </div>
        </div>
    );
};

export default TokenCount;
