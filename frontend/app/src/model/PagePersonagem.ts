import Pageable from './Pageable.js';
import Personagem from './Personagem.js';
import Sort from './Sort.js';

export default interface PagePersonagem {
    content: Array<Personagem>;
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    sort: Sort;
    totalElements: number;
    totalPages: number;
}