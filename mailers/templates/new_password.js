let passwordTemplate;
export default passwordTemplate = (user) => {
  return `
<div>
  <p>Hi ${user.name}!</p>
  <br />
  <p>Your password has been successfully updated.</p>
  <br />
  <P>Thanks!</P>
</div>
`;
};
