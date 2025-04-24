import { useNavigate } from "react-router-dom";
import classes from "./styles/EditProfilePage.module.css";
import { useSelector } from "react-redux";
import LoadingIndicator from "../UI/LoadingIndicator";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAccount,
  fetchSelectableProfileImages,
  queryClient,
  updateAccount,
} from "../util/http";
import Button from "../UI/Button";
import { useEffect, useState } from "react";
import Modal from "../UI/Modal";
import ImagePicker from "../UI/ImagePicker";
import { convertImageFilePathToName } from "../util/converter";
import ImagePickerSlider from "../UI/ImagePickerSlider";
import MessageBox from "../UI/MessageBox";
import Input from "../UI/Input";
import EditButton from "../UI/EditButton";
import InputSelect from "../UI/InputSelect";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const accountEmail = useSelector((state) => state.auth.email);

  const today = new Date().toISOString().split("T")[0];
  const minDate = "1900-01-01";

  const [status, setStatus] = useState({
    message: "",
    type: "",
    show: false,
  });

  const [originals, setOriginals] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });

  const [form, setForm] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });

  const [editing, setEditing] = useState({
    username: false,
    gender: false,
    dateOfBirth: false,
    password: false,
    profilePicture: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });

  const { mutate, isPending: isPendingUpdating } = useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      // {successes: [{field: fieldname}]}
      if (data && data.successes) {
        if (
          data.successes.find((success) => success.field === "profilePicture")
        ) {
          setErrors((prevErrors) => ({ ...prevErrors, profilePicture: "" }));
          setEditing((prevEdits) => ({ ...prevEdits, profilePicture: false }));
          setOriginals((prevOriginals) => ({
            ...prevOriginals,
            profilePicture: form.profilePicture,
          }));
        } else if (
          data.successes.find((success) => success.field === "username")
        ) {
          setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
          setEditing((prevEdits) => ({ ...prevEdits, username: false }));
          setOriginals((prevOriginals) => ({
            ...prevOriginals,
            username: form.username,
          }));
        } else if (
          data.successes.find((success) => success.field === "gender")
        ) {
          setErrors((prevErrors) => ({ ...prevErrors, gender: "" }));
          setEditing((prevEdits) => ({ ...prevEdits, gender: false }));
          setOriginals((prevOriginals) => ({
            ...prevOriginals,
            gender: form.gender,
          }));
        } else if (
          data.successes.find((success) => success.field === "dateOfBirth")
        ) {
          setErrors((prevErrors) => ({ ...prevErrors, dateOfBirth: "" }));
          setEditing((prevEdits) => ({ ...prevEdits, dateOfBirth: false }));
          setOriginals((prevOriginals) => ({
            ...prevOriginals,
            dateOfBirth: form.dateOfBirth,
          }));
        } else if (
          data.successes.find((success) => success.field === "password")
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: "",
            confirmPassword: "",
          }));
          setEditing((prevEdits) => ({ ...prevEdits, password: false }));

          setForm((prevForm) => ({
            ...prevForm,
            password: "",
            confirmPassword: "",
          }));
        }
      }

      setStatus({
        message: data.successes[0].message,
        type: "success",
        show: true,
      });

      setTimeout(() => setStatus((s) => ({ ...s, show: false })), 3000);

      queryClient.invalidateQueries({ queryKey: ["account"] });
    },

    onError: (errors) => {
      // {successes: [{field: fieldname}]}
      console.log(errors);
      if (errors) {
        if (errors.find((error) => error.field === "profilePicture")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            profilePicture: errors[0].message,
          }));

          setForm((prevForm) => ({
            ...prevForm,
            profilePicture: originals.profilePicture,
          }));
        } else if (errors.find((error) => error.field === "username")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: errors[0].message,
          }));

          setForm((prevForm) => ({
            ...prevForm,
            username: originals.username,
          }));
        } else if (errors.find((error) => error.field === "gender")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gender: errors[0].message,
          }));

          setForm((prevForm) => ({ ...prevForm, gender: originals.gender }));
        } else if (errors.find((error) => error.field === "dateOfBirth")) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            dateOfBirth: errors[0].message,
          }));

          setForm((prevForm) => ({
            ...prevForm,
            dateOfBirth: originals.dateOfBirth,
          }));
        } else if (
          errors.find(
            (error) =>
              error.field === "password" ||
              errors.find((error) => error.field === "confirmPassword")
          )
        ) {
          if (errors.find((error) => error.field === "password")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              password: errors[0].message,
            }));

            setForm((prevForm) => ({
              ...prevForm,
              password: "",
              confirmPassword: "",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: errors[0].message,
            }));
            setForm((prevForm) => ({ ...prevForm, confirmPassword: "" }));
          }
        } else if (errors.find((error) => error.field === "general")) {
          setStatus({
            message: errors[0].message,
            type: "error",
            show: true,
          });

          setTimeout(() => setStatus((s) => ({ ...s, show: false })), 3000);
        }
      }
    },
  });

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ["account", accountEmail],
    queryFn: ({ signal }) => fetchAccount({ signal, accountEmail }),
  });

  const {
    data: selectableImages,
    isLoading: isSelectableImagesLoading,
    isError: isSelectableImagesError,
    error: selectableImagesError,
  } = useQuery({
    queryKey: ["profile-images"],
    queryFn: fetchSelectableProfileImages,
    enabled: !!editing.profilePicture && !!accountData,
  });

  useEffect(() => {
    if (!accountData) return;

    setForm({
      username: accountData.username,
      gender: accountData.gender,
      dateOfBirth: accountData.dateOfBirth,
      profilePicture: convertImageFilePathToName(accountData.profilepicture),
      password: "",
      confirmPassword: "",
    });

    setOriginals({
      username: accountData.username,
      gender: accountData.gender,
      dateOfBirth: accountData.dateOfBirth,
      profilePicture: convertImageFilePathToName(accountData.profilepicture),
    });
  }, [accountData]);

  function handleEditProfileCancel() {
    setEditing((prevEdit) => ({
      ...prevEdit,
      profilePicture: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      profilePicture: originals.profilePicture,
    }));
    return true;
  }

  function handleEditPasswordCancel() {
    setEditing((prevEdit) => ({
      ...prevEdit,
      password: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      password: "",
      confirmPassword: "",
    }));
  }

  function handleSelectImage(image) {
    setForm((form) => ({
      ...form,
      profilePicture: image,
    }));
  }

  function handleUpdateProfileImage() {
    const payload = { email: accountEmail };
    if (editing.profilePicture) payload.profilePicture = form.profilePicture;
    mutate(payload);
  }

  function handleUpdatePassword() {
    const payload = { email: accountEmail };
    if (editing.password) {
      payload.password = form.password;
      payload.confirmPassword = form.confirmPassword;
    }
    mutate(payload);
  }

  function handleUpdateUsername() {
    const payload = { email: accountEmail };
    if (editing.username) {
      payload.username = form.username;
    }
    mutate(payload);
  }

  function handleEditUsernameCancel() {
    setEditing((prevEdit) => ({
      ...prevEdit,
      username: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      username: originals.username,
    }));
  }

  function handleUpdateGender() {
    const payload = { email: accountEmail };
    if (editing.gender) {
      payload.gender = form.gender;
    }
    mutate(payload);
  }

  function handleEditGenderCancel() {
    setEditing((prevEdit) => ({
      ...prevEdit,
      gender: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      gender: originals.gender,
    }));
  }

  function handleUpdateDOB() {
    const payload = { email: accountEmail };
    if (editing.dateOfBirth) {
      payload.dateOfBirth = form.dateOfBirth;
    }
    mutate(payload);
  }

  function handleEditDOBCancel() {
    setEditing((prevEdit) => ({
      ...prevEdit,
      dateOfBirth: false,
    }));

    setForm((prevForm) => ({
      ...prevForm,
      dateOfBirth: originals.dateOfBirth,
    }));
  }

  console.log(form);

  function handleBack() {
    navigate("/profile");
  }

  return (
    <>
      {isAccountLoading && <LoadingIndicator />}
      {accountData && (
        <>
          {editing.profilePicture && (
            <Modal
              open={editing.profilePicture}
              onClose={handleEditProfileCancel}
            >
              <div className="form">
                {isSelectableImagesLoading && <LoadingIndicator />}
                {isSelectableImagesError && (
                  <>
                    <p className="modal-message">
                      {selectableImagesError?.info?.message}
                    </p>
                    <Button
                      className="reject-btn"
                      onClick={handleEditProfileCancel}
                    >
                      OK
                    </Button>
                  </>
                )}
                {selectableImages && (
                  <>
                    <ImagePickerSlider
                      images={selectableImages}
                      onSelect={handleSelectImage}
                      selectedImage={form.profilePicture}
                    />
                    <div className={classes["update-actions"]}>
                      <Button
                        disabled={isPendingUpdating}
                        onClick={handleUpdateProfileImage}
                        className="update-btn"
                      >
                        Update
                      </Button>
                      <Button
                        disabled={isPendingUpdating}
                        onClick={handleEditProfileCancel}
                        className="update-cancel-btn"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Modal>
          )}
          <div className={classes["profile-container"]}>
            {/* Profile Card */}
            <div className={classes["profile-card"]}>
              <div className={classes["profile-header"]}>
                <div className={classes["avatar-container"]}>
                  <img
                    src={`http://localhost:8080/uploads/${form.profilePicture}`}
                    alt={`${accountData.username}'s avatar`}
                    className={classes["avatar"]}
                  />
                </div>

                <Button
                  onClick={() =>
                    setEditing((prevVal) => ({
                      ...prevVal,
                      profilePicture: true,
                    }))
                  }
                  className="update-btn"
                >
                  Update
                </Button>
              </div>
            </div>

            {status.show && (
              <MessageBox
                message={status.message}
                type={status.type}
                isVisible={status.show}
              />
            )}

            {/* Name */}
            <div className={classes["settings-card"]}>
              <div className="form">
                <Input
                  label="Name"
                  disabled={!editing.username || isPendingUpdating}
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter Your New Name"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                  value={form.username}
                  error={errors.username ? errors.username : null}
                />
                {editing.username && (
                  <div className={classes["update-actions"]}>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleUpdateUsername}
                      className="update-btn"
                    >
                      Update
                    </Button>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleEditUsernameCancel}
                      className="update-cancel-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <EditButton
                disabled={editing.username}
                isActive={editing.username}
                onClick={() =>
                  setEditing((prevVal) => ({
                    ...prevVal,
                    username: true,
                  }))
                }
              />
            </div>

            {/* Gender */}
            <div className={classes["settings-card"]}>
              <div className="form">
                <InputSelect
                  disabled={!editing.gender || isPendingUpdating}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gender: e.target.value }))
                  }
                  label="Gender"
                  id="gender"
                  name="gender"
                  value={form.gender}
                  error={errors.gender ? errors.gender : null}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </InputSelect>

                {editing.gender && (
                  <div className={classes["update-actions"]}>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleUpdateGender}
                      className="update-btn"
                    >
                      Update
                    </Button>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleEditGenderCancel}
                      className="update-cancel-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <EditButton
                disabled={editing.gender}
                isActive={editing.gender}
                onClick={() =>
                  setEditing((prevVal) => ({
                    ...prevVal,
                    gender: true,
                  }))
                }
              />
            </div>

            {/* Date */}
            <div className={classes["settings-card"]}>
              <div className="form">
                <Input
                  label="Date Of Birth"
                  min={minDate}
                  max={today}
                  disabled={!editing.dateOfBirth || isPendingUpdating}
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                  }
                  value={form.dateOfBirth}
                  error={errors.dateOfBirth ? errors.dateOfBirth : null}
                />

                {editing.dateOfBirth && (
                  <div className={classes["update-actions"]}>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleUpdateDOB}
                      className="update-btn"
                    >
                      Update
                    </Button>
                    <Button
                      disabled={isPendingUpdating}
                      onClick={handleEditDOBCancel}
                      className="update-cancel-btn"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              <EditButton
                disabled={editing.dateOfBirth}
                isActive={editing.dateOfBirth}
                onClick={() =>
                  setEditing((prevVal) => ({
                    ...prevVal,
                    dateOfBirth: true,
                  }))
                }
              />
            </div>

            {/* Password */}
            <div className={classes["settings-card"]}>
              <div className="form">
                <Input
                  label="New Password"
                  disabled={!editing.password || isPendingUpdating}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter New Password"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  value={form.password}
                  error={errors.password ? errors.password : null}
                />
                {editing.password && (
                  <>
                    <Input
                      label="Confirm New Password"
                      disabled={!editing.password || isPendingUpdating}
                      id="confirm-password"
                      type="password"
                      name="confirm-password"
                      placeholder="Confirm New Password"
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          confirmPassword: e.target.value,
                        }))
                      }
                      value={form.confirmPassword}
                      error={
                        errors.confirmPassword ? errors.confirmPassword : null
                      }
                    />
                    <div className={classes["update-actions"]}>
                      <Button
                        disabled={isPendingUpdating}
                        onClick={handleUpdatePassword}
                        className="update-btn"
                      >
                        Update
                      </Button>
                      <Button
                        disabled={isPendingUpdating}
                        onClick={handleEditPasswordCancel}
                        className="update-cancel-btn"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <EditButton
                disabled={editing.password}
                isActive={editing.password}
                onClick={() =>
                  setEditing((prevVal) => ({
                    ...prevVal,
                    password: true,
                  }))
                }
              />
            </div>
            <div className="back-btn-container">
              <Button onClick={handleBack} className="back-btn">
                BACK
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
