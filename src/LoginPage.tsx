import styles from "./LoginPage.module.css";
import { AES, enc } from "crypto-js";
import { ChangeEvent, useState } from "react";
import { FormEvent } from "react";
import storage from "./storage";
import { v4 as uuid } from "uuid";
import { UserData } from "./types";

const PASSPFRASE_STORAGE_KEY = "passphrase";

type Props = {
  setUserData: (userData: UserData) => void;
};

function LoginPage({ setUserData }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const encryptedPassphrase = storage.get<string | undefined>(
      `${username}:${PASSPFRASE_STORAGE_KEY}`
    );
    if (!encryptedPassphrase) {
      const passphrase = uuid();
      storage.set(
        `${username}:${PASSPFRASE_STORAGE_KEY}`,
        AES.encrypt(passphrase, password).toString()
      );
      setUserData({ username, passphrase });
      return;
    }
    const passphrase = AES.decrypt(encryptedPassphrase, password).toString(
      enc.Utf8
    );
    if (passphrase) {
      setUserData({ username, passphrase });
    } else {
      setErrorText("Wrong password");
    }
  };

  const hnadleChangeUsrname = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const hnadleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.pageConatiner}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        {errorText}
        <label>
          <div className={styles.labelText}>Username</div>
          <input
            name="username"
            type="text"
            className={styles.textField}
            onChange={hnadleChangeUsrname}
            value={username}
          />
        </label>
        <label>
          <div className={styles.labelText}>Password</div>
          <input
            name="password"
            type="password"
            className={styles.textField}
            onChange={hnadleChangePassword}
            value={password}
          />
        </label>
        <div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
