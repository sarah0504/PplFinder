import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";
import { useLocation } from "react-router-dom"

const UserList = ({ users, isLoading }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [actualUsers, setactualUsers] = useState([]);
  const [selected, setSelected] = useState([])
  const [favory, setfavory] = useState([])
  const { pathname } = useLocation()

  useEffect(() => {
    //Take the favory state of local storage
    if (!(window.localStorage.getItem('favory') === "" || window.localStorage.getItem('favory') === null)) {
      setfavory(JSON.parse(window.localStorage.getItem('favory')));
    }
    //Initialize users in home page
    if (pathname === "/") {
      setactualUsers(users);
    }
  }, []);

  useEffect(() => {
    //Initialize users in favorite page
    if (pathname === "/Favorite") {
      setactualUsers(favory);
    }

  }, [favory]);


  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };
  //Display only the filter users
  const handleChange = (label) => {
    let selected_temp = selected;
    let find = selected_temp.indexOf(label);

    if (find > -1) {
      selected_temp.splice(find, 1);
    } else { selected_temp.push(label); }

    setSelected(selected_temp);

    if (selected.length == 0) {
      setactualUsers(users);
    } else { setactualUsers(users.filter(x => selected.includes(x.location.country))); }

  };
  //Display only favorite users
  const handleclick = (e) => {
    let fav_temp = favory;
    let find = fav_temp.findIndex(item => item.cell === e);
    if (find > -1) {
      fav_temp.splice(find, 1);
    }
    else {
      fav_temp.push(users.find(item => item.cell === e));
    }
    setfavory(fav_temp);
    //Make the favorite users persistent
    window.localStorage.setItem('favory', JSON.stringify(favory));
  }

  return (
    <S.UserList>
      {pathname === "/" && <S.Filters>
        <CheckBox value="BR" onChange={handleChange} label="Brazil" />
        <CheckBox value="AU" onChange={handleChange} label="Australia" />
        <CheckBox value="CA" onChange={handleChange} label="Canada" />
        <CheckBox value="DE" onChange={handleChange} label="Germany" />
        <CheckBox value="FR" onChange={handleChange} label="France" />

      </S.Filters>}
      <S.List>
        {actualUsers.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <S.UserPicture src={user?.picture.large} alt="" />
              <S.UserInfo>
                <Text size="22px" bold>
                  {user?.name.title} {user?.name.first} {user?.name.last}
                </Text>
                <Text size="14px">{user?.email}</Text>
                <Text size="14px">
                  {user?.location.street.number} {user?.location.street.name}
                </Text>
                <Text size="14px">
                  {user?.location.city} {user?.location.country}
                </Text>
              </S.UserInfo>
              <S.IconButtonWrapper onClick={() => handleclick(user.cell)} isVisible={index === hoveredUserId || favory.findIndex(item => user.cell === item.cell)}>
                <IconButton >
                  <FavoriteIcon color="error" />
                </IconButton>
              </S.IconButtonWrapper>
            </S.User>
          );
        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>);

};

export default UserList;
