import { useSelector } from "react-redux"
import { RootState } from "state_management/reducers/rootReducer";

const useCreatedBy = (id : string) => {
    const staffList = useSelector((state: RootState) => state.staffSlice);
    return staffList.find((staff) => staff.id === id )?.staffName ?? id
}

export default useCreatedBy;