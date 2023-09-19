import { useState, useEffect } from "react";
import axios from "axios";
import validateEditUserSchema from "../validation/editUserValidation";
import { validateEditUserParamsSchema } from "../validation/editUserValidation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { Col, Row, Card, Form, Button } from "@themesberg/react-bootstrap";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const EditProfile = () => {
  const navigate = useNavigate();

  const [inputsErrorsState, setInputsErrorsState] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [inputState, setInputState] = useState({
    name: { firstName: "", lastName: "" },
    phoneNumber: "",
    email: "",
    address: {
      state: "",
      country: "",
      city: "",
      street: "",
      houseNumber: "",
      zip: "",
    },
    gender: "",
  });

  const [initialInputState, setInitialInputState] = useState(inputState);
  const [loading, setLoading] = useState(true);
  const isUpdated =
    JSON.stringify(initialInputState) !== JSON.stringify(inputState);

  const handleInputChange = (id, value, isAddressField = false) => {
    if (id) {
      if (id === "firstName" || id === "lastName") {
        setInputState((prevState) => ({
          ...prevState,
          name: {
            ...prevState.name,
            [id]: value,
          },
        }));
      } else if (isAddressField) {
        setInputState((prevState) => ({
          ...prevState,
          address: {
            ...prevState.address,
            [id]: value,
          },
        }));
      } else {
        setInputState((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      }
    }
  };

  const handleInputBlur = () => {
    const isFormCurrentlyValid =
      inputState.name.firstName !== "" &&
      inputState.name.lastName !== "" &&

      setIsFormValid(isFormCurrentlyValid);
  };

  useEffect(() => {
    (async () => {
      try {
        const errors = validateEditUserParamsSchema();
        if (errors) {
          navigate("/");
          return;
        }
        const { data } = await axios.get("/users/userInfo/");
        let newInputState = {
          name: {
            firstName: data.name.firstName || "",
            lastName: data.name.lastName || "",
          },
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          address: {
            state: data.address.state || "",
            country: data.address.country || "",
            city: data.address.city || "",
            street: data.address.street || "",
            houseNumber: data.address.houseNumber || "",
            zip: data.address.zip || "",
          },
          gender: data.gender || "",
        };

        setInputState(newInputState);
        setInitialInputState(newInputState);
      } catch (error) {
        console.log("error from axios", error);
        toast.error("Connection error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveBtnClick = async (event) => {
    event.preventDefault();
    let dataToSend = { ...inputState };
    delete dataToSend.password;

    const joiResponse = validateEditUserSchema(dataToSend);
    setInputsErrorsState(joiResponse);
    if (joiResponse) {
      return;
    }

    try {
      await axios.put("/users/userInfo", dataToSend);
      let userData = await axios.get("/users/userInfo");
      let userId = userData.data._id;
      let dataToCards = { "user": `${inputState.name.firstName || ""} ${inputState.name.lastName || ""}` };
      await axios.put(`/cards/my_all_cards/${userId}`, dataToCards);
      navigate("/");
      toast.success("User details updated successfully");
    } catch (error) {
      toast.error("Connection error");
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <br />
        <h5 className="mb-4">Update information *</h5>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                {" "}
                <br />
                <Form.Group id="firstName">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    name="firstName"
                    type="text"
                    value={inputState.name.firstName}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("firstName", event.target.value);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.firstName && (
                      <Alert severity="warning">
                        {inputsErrorsState.firstName.map((item) => (
                          <div key={"firstName-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                {" "}
                <br />
                <Form.Group id="lastName">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    name="lastName"
                    type="text"
                    value={inputState.name.lastName}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("lastName", event.target.value);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.lastName && (
                      <Alert severity="warning">
                        {inputsErrorsState.lastName.map((item) => (
                          <div key={"lastName-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                {" "}
                <br />
                <Form.Group id="email">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={inputState.email}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Divider sx={{ backgroundColor: "#424242" }} />
            <br />
            <h5 className="my-4">General Information -</h5>
            <Row className="align-items-center">
              <Col md={6} className="mb-3">
                <br />
                <Form.Group id="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={inputState.gender}
                    onChange={(event) =>
                      setInputState({
                        ...inputState,
                        gender: event.target.value,
                      })
                    }
                    onBlur={handleInputBlur}
                  >
                    <option value="">Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                {" "}
                <br />
                <Form.Group id="phoneNumber">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    type="tel"
                    placeholder="+12-345 678 910"
                    value={inputState.phoneNumber}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("phoneNumber", event.target.value);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.phoneNumber && (
                      <Alert severity="warning">
                        {inputsErrorsState.phoneNumber.map((item) => (
                          <div key={"phoneNumber-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <br />
            <h5 className="my-4">Address -</h5>
            <Row>
              <Col sm={6} className="mb-3">
                <br />
                <Form.Group id="street">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    name="street"
                    type="text"
                    placeholder="Enter your street address"
                    value={inputState.address.street}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("street", event.target.value, true);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.street && (
                      <Alert severity="warning">
                        {inputsErrorsState.street.map((item) => (
                          <div key={"street-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
              <Col sm={6} className="mb-3">
                <br />
                <Form.Group id="houseNumber">
                  <Form.Label>House Number</Form.Label>
                  <Form.Control
                    name="houseNumber"
                    type="text"
                    placeholder="Enter your house number"
                    value={inputState.address.houseNumber}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange(
                          "houseNumber",
                          event.target.value,
                          true
                        );
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.houseNumber && (
                      <Alert severity="warning">
                        {inputsErrorsState.houseNumber.map((item) => (
                          <div key={"houseNumber-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col sm={6} className="mb-3">
                {" "}
                <br />
                <Form.Group id="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    type="text"
                    placeholder="Enter your city"
                    value={inputState.address.city}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("city", event.target.value, true);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.city && (
                      <Alert severity="warning">
                        {inputsErrorsState.city.map((item) => (
                          <div key={"city-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
              <Col sm={6} className="mb-3">
                <br />
                <Form.Group id="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="state"
                    type="text"
                    placeholder="Enter your state"
                    value={inputState.address.state}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("state", event.target.value, true);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.state && (
                      <Alert severity="warning">
                        {inputsErrorsState.state.map((item) => (
                          <div key={"state-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6} className="mb-3">
                <br />
                <Form.Group id="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    name="country"
                    type="text"
                    placeholder="Enter your country"
                    value={inputState.address.country}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("country", event.target.value, true);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.country && (
                      <Alert severity="warning">
                        {inputsErrorsState.country.map((item) => (
                          <div key={"country-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
              <Col sm={6} className="mb-3">
                <br />
                <Form.Group id="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    name="zip"
                    type="text"
                    placeholder="Enter your zip code"
                    value={inputState.address.zip}
                    onChange={(event) => {
                      if (
                        event &&
                        event.target &&
                        event.target.value !== undefined
                      ) {
                        handleInputChange("zip", event.target.value, true);
                      }
                    }}
                    onBlur={handleInputBlur}
                  />
                  {inputsErrorsState &&
                    inputsErrorsState.zip && (
                      <Alert severity="warning">
                        {inputsErrorsState.zip.map((item) => (
                          <div key={"zip-errors-" + item}>{item}</div>
                        ))}
                      </Alert>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                size="small"
                style={{
                  backgroundColor: "#008080",
                  color: "white",
                  padding: "0.8rem 1.8rem",
                }}
                onClick={handleSaveBtnClick}
                disabled={!isUpdated}
              >
                Update
              </Button>
            </Box>
          </Form>
        )}
      </Card.Body>
      <br />
      <br />
      <br />
    </Card>
  );
};

export default EditProfile;
