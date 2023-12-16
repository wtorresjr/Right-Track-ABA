const ClientInfo = ({ client }) => {
  return <p key={client?.id}>{client?.first_name}</p>;
};

export default ClientInfo;
