
import MainLayout from "@/components/layout/MainLayout";
import From from "@/components/supplierform/From";
import { Provider } from "react-redux";
import store  from "@/store/store";




export default async function HomePage() {

  return (
   <Provider store={store}>
     <MainLayout>
        <From />
     </MainLayout>
   </Provider>
  );
}