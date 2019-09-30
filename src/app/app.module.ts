import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';
import { CommonService } from './service/common.service';
import { ChatService } from './service/chat.service';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { LoginComponent } from './components/login/login.component';
import { ApiService } from './service/api.service';
import { AutofocuseDirective } from './directives/autofocuse.directive';


// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { NewChannelComponent } from './components/new-channel/new-channel.component';
@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    LoginComponent,
    AutofocuseDirective,
    NewChannelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxSpinnerModule,
    UiSwitchModule
  ],
  providers: [CommonService, ChatService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
