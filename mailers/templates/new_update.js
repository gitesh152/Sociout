let updateTemplate;
export default updateTemplate = (user) => {
    return `
<div>
  <p>Hi ${user.name}!</p>
  <br />
  <p>Your profile has been successfully updated.</p>
  <br />
  <P>Thanks!</P>
</div>
`;
};
