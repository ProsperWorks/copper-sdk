import { assert, expect } from 'chai';
import sinon from 'sinon';
import EntityModel from 'src/entity-model';
import { version } from '../package.json';
import PWSDK from '../src/index';
import { IPostMessageData, UITarget } from '../src/interfaces';

describe('PWSDK', function () {
  context('when init', function () {
    it('should throw error if invalid arguments', function () {
      expect(() => {
        PWSDK.init();
      }).to.throw(TypeError, 'parentOrigin or instanceId is empty');
    });
  });

  context('when checking version', function () {
    it('should be the same as the version from package.json', function () {
      expect(PWSDK.version).to.equal(version);
    });
  });

  context('when create new instance', function () {
    it('should throw if not enough parameter', function () {
      expect(() => {
        // need to cast it to any so typescript won't throw error
        const sdk = new (PWSDK as any)(); // tslint:disable-line
      }).to.throw(TypeError, 'parentOrigin or instanceId is empty');
    });
  });

  context('when using sdk public methods', function () {
    let sdk: PWSDK;
    let win: any;

    const origin = 'https://prosperworks.com';
    const instanceId = '1';

    beforeEach(function () {
      win = {
        addEventListener: window.addEventListener.bind(window),
        top: {
          postMessage: sinon.stub(),
        },
      };
      sdk = new PWSDK(origin, instanceId, win);
    });

    context('#getContext', function () {
      it('should be able to get context from parent', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'getContext',
                data: {
                  entityType: 'person',
                  entityData: { id: '1', name: 'Alice' },
                  editableFields: ['name'],
                },
              },
            }),
          );
        });
        const data = await sdk.getContext();
        expect(data.type).to.equal('person');
        expect(data.context.toObject()).to.eql({
          id: '1',
          name: 'Alice',
        });
      });
    });

    context('#saveContext', function () {
      it('should be able to save context', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'saveContext',
                data: {
                  entityType: 'person',
                  entityData: { id: '1', name: 'Alice' },
                  editableFields: ['name'],
                },
              },
            }),
          );
        });

        const model = new EntityModel('person', { id: 1, name: 'Bob' }, ['name']);
        const data = await sdk.saveContext(model);
        expect(data.type).to.equal('person');
        expect(data.context.toObject()).to.eql({
          id: '1',
          name: 'Alice',
        });
      });
    });

    context('#setAppUI', function () {
      it('should be able to receive ui settings', function () {
        sdk.setAppUI({ count: 0 });
        win.top.postMessage.calledWith(
          sinon.match((value: IPostMessageData) => {
            return expect(value).to.eql({
              type: 'setUI',
              instanceId,
              version,
              data: {
                count: 0,
              },
            });
          }),
        );
      });
    });

    context('#showModal', function () {
      it('should be able to show modal', function () {
        sdk.showModal({ name: 'Alice' });
        win.top.postMessage.calledWith(
          sinon.match((value: IPostMessageData) => {
            return expect(value).to.eql({
              type: 'showModal',
              instanceId,
              version,
              params: {
                name: 'Alice',
              },
            });
          }),
        );
      });
    });

    context('#closeModal', function () {
      it('should be able to close modal', function () {
        sdk.closeModal();
        win.top.postMessage.calledWith(
          sinon.match((value: IPostMessageData) => {
            return expect(value).to.eql({
              type: 'closeModal',
              instanceId,
              version,
            });
          }),
        );
      });
    });

    context('#publishMessage', function () {
      it('should be able to close modal', function () {
        sdk.publishMessage('closeModal', 'target', {
          yo: 42,
        });
        win.top.postMessage.calledWith(
          sinon.match((value: IPostMessageData) => {
            return expect(value).to.eql({
              type: 'publishMessage',
              instanceId,
              version,
              target: 'target',
              data: {
                type: 'closeModal',
                msg: {
                  yo: 42,
                },
              },
            });
          }),
        );
      });
    });

    context('#on and #trigger', function () {
      it('should trigger methods and subscribe it correctly', function () {
        const spy1 = sinon.spy();
        sdk.on('myevent1', spy1);
        sdk.trigger('myevent1', { yo: 42 });
        sdk.trigger('myevent1', { yo: 42 });

        assert(spy1.calledTwice);
        assert(spy1.calledWithMatch(sinon.match.has('yo', 42)));
      });

      it('should trigger all callback subscribed to one event', function () {
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        sdk.on('myevent1', spy1);
        sdk.on('myevent1', spy2);
        sdk.trigger('myevent1', { yo: 42 });

        assert(spy1.calledWithMatch(sinon.match.has('yo', 42)));
        assert(spy2.calledWithMatch(sinon.match.has('yo', 42)));
      });
    });

    context('#logActivity', function () {
      it('should call api and refreshUI', async function () {
        const clock = sinon.useFakeTimers();
        sinon.stub(sdk, 'api').resolves({
          id: 1,
          details: 'Some Activity',
          parent: {
            id: 2,
            type: 'person',
          },
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('person', { id: 2, name: 'Bob' }, []),
        });
        const result = await sdk.logActivity(1, 'Some Activity');
        clock.runAll();
        expect(result).to.eql({
          id: 1,
          details: 'Some Activity',
          parent: {
            id: 2,
            type: 'person',
          },
        });
        assert(spy.called, 'refresh UI should be called');
        clock.restore();
      });

      it('should call api and refreshUI with date and delay', async function () {
        const clock = sinon.useFakeTimers();
        const now = Math.floor(Date.now() / 1000);
        sinon.stub(sdk, 'api').resolves({
          id: 1,
          details: 'Some Activity',
          parent: {
            id: 2,
            type: 'person',
          },
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('person', { id: 2, name: 'Bob' }, []),
        });
        const result = await sdk.logActivity(1, 'Some Activity', now, 2000);
        assert.isFalse(spy.called, 'refresh UI is not called yet');
        clock.tick(2000);
        expect(result).to.eql({
          id: 1,
          details: 'Some Activity',
          parent: {
            id: 2,
            type: 'person',
          },
        });
        assert(spy.called, 'refresh UI should be called');
        clock.restore();
      });
    });

    context('#createEntity', function () {
      it('should call api and refreshUI', async function () {
        const clock = sinon.useFakeTimers();
        sinon.stub(sdk, 'api').resolves({
          id: 3,
          name: 'Cathy',
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('person', {}, []),
        });
        const result = await sdk.createEntity('person', {
          name: 'Cathy',
        });
        clock.runAll();
        expect(result).to.eql({
          id: 3,
          name: 'Cathy',
        });
        assert(
          spy.calledWith({
            name: UITarget.ListView,
            data: {
              entityType: 'person',
              entityData: {
                id: 3,
                name: 'Cathy',
              },
            },
          }),
          'refresh UI should be called',
        );
        clock.restore();
      });

      it('should call api and not refreshUI', async function () {
        const clock = sinon.useFakeTimers();
        sinon.stub(sdk, 'api').resolves({
          id: 3,
          name: 'Cathy',
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('lead', {}, []),
        });
        const result = await sdk.createEntity('person', {
          name: 'Cathy',
        });
        clock.runAll();
        expect(result).to.eql({
          id: 3,
          name: 'Cathy',
        });
        assert(spy.notCalled);
        clock.restore();
      });
    });

    context('#relateEntity', function () {
      it('should call api and refreshUI', async function () {
        const clock = sinon.useFakeTimers();
        sinon.stub(sdk, 'api').resolves({
          added: true,
          resource: {
            id: 2,
            type: 'opportunity',
          },
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('person', { id: 1 }, []),
        });
        const result = await sdk.relateEntity('person', 1, {
          id: 2,
          type: 'opportunity',
        });
        clock.runAll();
        expect(result).to.eql({
          added: true,
          resource: {
            id: 2,
            type: 'opportunity',
          },
        });
        assert(
          spy.calledWith({
            name: UITarget.Related,
            data: {
              id: 2,
              type: 'opportunity',
            },
          }),
          'refresh UI should be called',
        );
        clock.restore();
      });

      it('should call api and not refreshUI', async function () {
        const clock = sinon.useFakeTimers();
        sinon.stub(sdk, 'api').resolves({
          added: true,
          resource: {
            id: 2,
            type: 'opportunity',
          },
        });
        const spy = sinon.stub(sdk, 'refreshUI');
        sinon.stub(sdk, 'getContext').resolves({
          type: 'person',
          context: new EntityModel('person', { id: 2 }, []),
        });

        const result = await sdk.relateEntity('person', 1, {
          id: 2,
          type: 'opportunity',
        });
        clock.runAll();
        expect(result).to.eql({
          added: true,
          resource: {
            id: 2,
            type: 'opportunity',
          },
        });
        assert(spy.notCalled);
        clock.restore();
      });
    });

    context('message handler', function () {
      it('should not respond to message from unknown origin', function () {
        const spy = sinon.spy(sdk, 'trigger');
        window.dispatchEvent(
          new MessageEvent('message', {
            origin: 'https://otherorigin.com',
            data: {
              type: 'myType',
              context: {
                id: '1',
                name: 'Alice',
              },
            },
          }),
        );
        assert(spy.notCalled);
        spy.restore();
      });

      it('should not trigger if message does not have type', function () {
        const spy = sinon.spy(sdk, 'trigger');
        window.dispatchEvent(
          new MessageEvent('message', {
            origin,
            data: {
              foo: 'bar',
            },
          }),
        );
        assert(spy.notCalled);
        spy.restore();
      });
    });

    context('#refreshUI', function () {
      it('should call _postMessage ', function () {
        const target = { name: UITarget.ActivityLog, data: { foo: 'bar' } };
        sdk.refreshUI(target);
        win.top.postMessage.calledWith(
          sinon.match((value: IPostMessageData) => {
            return expect(value).to.eql({
              type: 'refreshUI',
              instanceId,
              version,
              target: { name: UITarget.ActivityLog, data: { foo: 'bar' } },
            });
          }),
        );
      });
    });

    context('#api', function () {
      it('should fail when url is empty', async function () {
        try {
          await sdk.api('');
        } catch (e) {
          expect(e).to.eql({
            id: 'sdk-api',
            version,
            detail: 'url cannot be empty',
          });
        }
      });

      it('should fail when options.body is not valid json', async function () {
        try {
          await sdk.api('http://localhost', {
            body: '{foo}',
          });
        } catch (e) {
          expect(e).to.eql({
            id: 'sdk-api',
            version,
            detail: 'body must be a valid JSON string',
          });
        }
      });

      it('should send api message', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'api',
                data: {
                  foo: 'bar',
                },
              },
            }),
          );
        });

        const data = await sdk.api('http://localhost', { method: 'GET' });
        expect(data).to.eql({
          foo: 'bar',
        });
      });
    });

    context('#navigateToEntityDetail', function () {
      it('should navigate to entity correctly ', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'navigateToEntityDetail',
                data: true,
              },
            }),
          );
        });

        const data = await sdk.navigateToEntityDetail('person', 1);
        expect(data).to.equal(true);
      });

      it('should fail if entity type is not valid', async function () {
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'navigateToEntityDetail',
                error: {
                  id: 'pw-navigateToEntityDetail',
                  version,
                  detail: 'Error Message',
                },
              },
            }),
          );
        });

        try {
          await sdk.navigateToEntityDetail('wrong', 1);
        } catch (e) {
          expect(e).to.eql({
            id: 'pw-navigateToEntityDetail',
            version,
            detail: 'Error Message',
          });
        }
      });
    });

    context('deferredQueue', function () {
      it('should resolve based on fifo', async function () {
        const data = [
          { entityType: 'foo', entityData: { id: '1', name: 'Alice' }, editableFields: ['name'] },
          { entityType: 'bar', entityData: { id: '2', name: 'Bob' }, editableFields: ['name'] },
        ];
        let count = 0;
        win.top.postMessage.callsFake(function () {
          window.dispatchEvent(
            new MessageEvent('message', {
              origin,
              data: {
                type: 'getContext',
                data: data[count++],
              },
            }),
          );
        });

        // allow us to access private method
        expect((sdk as any).deferredQueues.getContext).to.be.undefined;

        const [data1, data2] = await Promise.all([sdk.getContext(), sdk.getContext()]);

        expect(data1.context.toObject()).to.eql(data[0].entityData);
        expect(data2.context.toObject()).to.eql(data[1].entityData);
        expect((sdk as any).deferredQueues.getContext)
          .to.be.an('array')
          .that.has.length(0);
      });
    });
  });
});
