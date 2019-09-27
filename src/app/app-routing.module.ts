import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { NewChannelComponent } from './components/new-channel/new-channel.component';

const routes: Routes = [
  { path: 'chat-room', component: ChatRoomComponent },
  { path: 'login', component: LoginComponent },
  { path: 'creat-channel', component: NewChannelComponent },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
