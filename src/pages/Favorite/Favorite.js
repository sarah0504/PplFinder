import React from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import { usePeopleFetch } from "hooks";
import * as S from "./style";

const Favorite = () => {
  const { users, isLoading } = usePeopleFetch();

  return  users.length > 0 ?  (
    <S.Favorite>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            Favorite
          </Text>
        </S.Header>
        <UserList users={users}  isLoading={isLoading} />
      </S.Content>
    </S.Favorite>
  ): (<span>Waiting for users...</span>);
};

export default Favorite;
