import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonService } from './service/common.service';
import { ChatService } from './service/chat.service';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { LoginComponent } from './components/login/login.component';
import { ApiService } from './service/api.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [CommonService, ChatService, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
