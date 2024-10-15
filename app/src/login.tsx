import React, { useEffect, useRef, useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import { useUserStore } from "./store/user";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login: React.FC = () => {
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);

  // 获取 VS Code 的 API
  const vscodeRef = useRef(window?.acquireVsCodeApi());
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    // eslint-disable-next-line
    (vscodeRef.current as any)?.postMessage({
      command: "login1",
      data: values,
    });
    setLoading(true);
    fetch(import.meta.env.VITE_LOGIN_URL, {
      body: JSON.stringify({
        appKey: import.meta.env.VITE_APP_KEY,
        loginName: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD,
        loginType: 10,
        isRememberMe: false,
        agreementFlag: 1,
      }),
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log("登录结果", r);
        setUser(r.data.ssoUser, r.data.token);
        message.success("登录成功");
      })
      .catch((e) => {
        console.log("登录异常", e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.addEventListener("message", (ev) => {
      if (ev.data && ev.data.command) {
        message.success(`收到插件主线程的消息: ${ev.data.command}`);
      }
    });
  }, []);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ username: "jcadmin", password: "jcadmin" }}
        onFinish={onFinish}
        autoComplete="off"
        title="登录"
      >
        <Form.Item<FieldType>
          label="账号"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
