export class Review {
    public id: number;
    public studentNumber: string;
    public requestTime: string;
    public assignmentId: number;

    constructor(
        id: number,
        studentNumber: string,
        requestTime: string,
        assignmentId: number
    ) {
        this.id = id;
        this.studentNumber = studentNumber;
        this.assignmentId = assignmentId;

        let date = new Date(requestTime);
        this.requestTime = `Requested review at [${date.getHours()}:${date.getMinutes()}]`;
    }
}
