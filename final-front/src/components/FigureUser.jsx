import "./FigureUser.css";
export const FigureUser = (user) => {
  return (
    <figure className="dataProfile">
      <img src={user.user.image} alt="user image" className="imageUser" />
      <h4 className="emailUser">{user.user.email}</h4>
    </figure>
  );
};
