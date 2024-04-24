import useCreatedBy from "hooks/useCreatedBy"

export const SellerName = ({id} : {id: string}) => {
    const name = useCreatedBy(id);
    return  <>{name}</>
}