import { Module } from "@nestjs/common";
import { AceDataCustomerProvider } from "./acedataCustomer/aceDataCustomer.provider";
import { AceDataAuthenticationFactory } from "./authentication/authenticationAceData.factory";

@Module({
  providers: [AceDataCustomerProvider, AceDataAuthenticationFactory],
  exports: [AceDataCustomerProvider, AceDataAuthenticationFactory]

})
export class AceDataModule {}