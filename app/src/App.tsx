import { useEffect, useState } from "react";
import Login from "./login";
import { useUserStore } from "./store/user";
import { TreeSelect } from "antd";

interface SourceMenuItem {
  id: number;
  isHidden: boolean;
  name: string;
  parentId: number;
  path: string;
  resKey: string;
  shortName: string;
  sortIndex: number;
  /**
   * 40-目录 50-页面 60-功能
   */
  type: 40 | 50 | 60;
  iconStyle?: string | null;
  children?: SourceMenuItem[];
}
function App() {
  const { user, token } = useUserStore();
  const [value, setValue] = useState<string[]>();
  const [menus, setMenus] = useState<SourceMenuItem[]>([]);

  useEffect(() => {
    if (!token || !user) return;
    fetch(import.meta.env.VITE_SOURCE_URL, {
      headers: {
        [import.meta.env.VITE_TOKEN_HEADER]: token,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        console.log("资源信息", r.data);
        setMenus([...r.data[0].children]);
      });
  }, [user, token]);

  if (!user || !token) {
    return <Login />;
  }

  return (
    <div>
      <TreeSelect
        showSearch
        style={{ width: "100%" }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="请选择资源点"
        allowClear
        multiple
        onChange={setValue}
        treeData={menus}
        fieldNames={{ label: "name", value: "id", children: "children" }}
      />
    </div>
  );
}

export default App;
