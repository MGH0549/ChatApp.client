import { inject, PLATFORM_ID, Service } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, finalize, take } from 'rxjs';
import { Message } from '../models/message';
import { BusyService } from './busy';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AccountService } from './account.service';
import { User } from '../models/user';


@Service()
export class Messageservice {
    baseUrl = environment.apiUrl;
    hubUrl = environment.hubUrl;
    private hubConnection?: HubConnection;
    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();
    private http: HttpClient = inject(HttpClient);
    private busyService: BusyService = inject(BusyService);
    private platformId = inject(PLATFORM_ID);
    private accountService: AccountService = inject(AccountService);

    createHubConnection(user: User, otherUsername: string) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
                accessTokenFactory: () => user.token?? '',
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch(error => console.log(error));

        this.hubConnection.on('ReceiveMessageThread', messages => {
            this.messageThreadSource.next(messages);
        });

        this.hubConnection.on('NewMessage', message => {
            this.messageThread$.pipe(take(1)).subscribe(messages => {
                this.messageThreadSource.next([...messages, message]);
            });
        });
    }

    stopHubConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop().catch(error => console.log(error));
        }
    }

    async sendMessage(username: string, content: string) {
       return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
      .catch(error => console.log(error));
    }

    getMessages(pageNumber: number, pageSize: number, container: string) {
        let params = getPaginationHeaders(pageNumber, pageSize);
        params = params.append('Container', container);
        
        params=params.append('Username',JSON.parse(localStorage.getItem('user') || '')?.username || '');
        return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
    }   
    getMessageThread(username: string) {
        return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }
    deleteMessage(id: number) {
        return this.http.delete(this.baseUrl + 'messages/' + id);
    }
}
