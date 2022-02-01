import { Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import { selectLand } from "../../../actions";

const LandList = () => {
    const dispatch = useDispatch();
    const lands = useSelector((state) =>
        Object.values(state.landReducer.lands)
    );
    return (
        <Box>
            {lands.map((land) => {
                return (
                    <Box
                        key={land.id}
                        onClick={() => {
                            dispatch(selectLand(land.id));
                        }}
                    >
                        {land.id}
                    </Box>
                );
            })}
        </Box>
    );
};

export default LandList;
