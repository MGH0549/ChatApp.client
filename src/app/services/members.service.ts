import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { User } from '../models/user';
import { UserParam } from '../models/userparam';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { map, of, take } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];
    memberCache = new Map();
    user: User | undefined;
    userParams: UserParam | undefined;

   
    private http = inject(HttpClient);

    constructor(private accountservice: AccountService) {
        this.accountservice.currentUser$.pipe(take(1)).subscribe({
            next: user => {
                if (user) {
                    this.user = user;
                    this.userParams = new UserParam(user);
                }
            }
        })
    }

    getUserParams() {
        return this.userParams;
    }

    setUserParams(params: UserParam) {
        this.userParams = params;
    }

    resetUserParams() {
        if (this.user) {
            this.userParams = new UserParam(this.user);
            return this.userParams;
        }
        return;
    }


    getMembers(userParams: UserParam) {
        const key = Object.values(userParams).join('-');
        const cachedResponse = this.memberCache.get(key);

        if (cachedResponse) {
            return of(cachedResponse);
        }

        let params = getPaginationHeaders(
            userParams.pageNumber,
            userParams.pageSize
        );

        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return getPaginatedResult<Member[]>(
            this.baseUrl + 'users',
            params,
            this.http
        ).pipe(
            map(response => {
                this.memberCache.set(key, response);
                return response.result;
            })
        );
    }

    getMember(username: string) {
        const member = [...this.memberCache.values()]
            .reduce((arr, elem) => arr.concat(elem), [])
            .find((member: Member) => member.userName === username);

        if (member) {
            return of(member);
        }

        return this.http.get<Member>(this.baseUrl + 'users/' + username);
    }

    updateMember(member: Member) {
        return this.http.put(this.baseUrl + 'users', member).pipe(
            map(() => {
                const index = this.members.indexOf(member);
                this.members[index] = { ...this.members[index], ...member };
            })
        );
    }

    setMainPhoto(photoId: number) {
        return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
    }

    deletePhoto(photoId: number) {
        return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
    }

    addLike(username: string) {
        return this.http.post(this.baseUrl + 'likes/' + username, {});
    }

    getLikes(predicate: string, pageNumber: number, pageSize: number) {
        let params = getPaginationHeaders(pageNumber, pageSize);
        params = params.append('predicate', predicate);
        return getPaginatedResult<Member[]>(this.baseUrl + 'likes', params, this.http);
    }
}
