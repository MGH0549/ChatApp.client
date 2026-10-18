import { inject, PLATFORM_ID, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { ToastrService } from '@relynn/ngx-toastr';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Service()
export class PresenceService {
    hubUrl = environment.hubUrl;
    private hubConnection?: HubConnection;
    private onlineUsersSource = new BehaviorSubject<string[]>([]);
    onlineUsers$ = this.onlineUsersSource.asObservable();

    private toastr= inject(ToastrService);
    private router= inject(Router);
    private platformId= inject(PLATFORM_ID);

    createHubConnection(user: User) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'presence', {
                accessTokenFactory: () => user.token ?? '',
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('UserIsOnline', username => {
            this.onlineUsers$.pipe(take(1)).subscribe({
                next: usernames => {
                    this.onlineUsersSource.next([...usernames, username]);
                }
            })
        })

        this.hubConnection.on('UserIsOffline', username => {
            this.onlineUsers$.pipe(take(1)).subscribe({
                next: usernames => {
                    this.onlineUsersSource.next(usernames.filter(x => x !== username));
                }
            })
        })

        this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
            this.onlineUsersSource.next(usernames);
        })

        this.hubConnection.on('NewMessageReceived', ({username, knownAs}) => {
            if (isPlatformBrowser(this.platformId)) {
            this.toastr.info(knownAs + ' has sent you a new message!')!
                .onTap
                .pipe(take(1))
                .subscribe({
                    next: () => this.router.navigateByUrl('/members/' + username + '?tab=Messages')
                })
            }
        })
    }

    stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
    }
}
